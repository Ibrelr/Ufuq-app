#!/usr/bin/env node
/**
 * Turns the spreadsheets in content/ into the data the app uses.
 *
 *   content/topics.csv  → one row per topic (order, level, type, icon, names)
 *   content/words.csv   → one row per word or sentence
 *
 * Output (generated, not committed):
 *   src/content/generated/topics.json
 *   public/pics/<name>.svg            pictures from Microsoft Fluent Emoji (MIT)
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 * Edit the CSV files in Google Sheets or Excel, export as "CSV UTF-8", and save over the old files.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const iconSet = require('@iconify-json/fluent-emoji-flat/icons.json')
const chars = require('@iconify-json/fluent-emoji-flat/chars.json')

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1']
const TYPES = ['words', 'phrases']

/* ---------- CSV ---------- */
function parseCsv(text) {
  text = text.replace(/^﻿/, '') // Excel's BOM
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const [header, ...body] = rows.filter((r) => r.some((f) => f.trim() !== ''))
  const keys = header.map((h) => h.trim())
  return body.map((r, n) => {
    const obj = { _line: n + 2 }
    keys.forEach((k, i) => (obj[k] = (r[i] ?? '').trim()))
    return obj
  })
}

const read = (f) => parseCsv(readFileSync(join(root, 'content', f), 'utf8'))

/* ---------- pictures ---------- */
const svgCache = new Map()
function iconData(name, depth = 0) {
  const icon = iconSet.icons[name]
  if (icon) return icon
  const alias = iconSet.aliases?.[name]
  if (alias && depth < 5) return { ...iconData(alias.parent, depth + 1), ...alias, parent: undefined }
  return null
}
// Emojis the set has under a name but not in its character map
const OVERRIDES = { '👉': 'backhand-index-pointing-right' }

/** Emoji → Fluent Emoji icon name, or null if the set doesn't have it */
function emojiToIcon(emoji) {
  if (OVERRIDES[emoji]) return OVERRIDES[emoji]
  const cps = [...emoji].map((c) => c.codePointAt(0).toString(16))
  const tries = [cps, cps.filter((c) => c !== 'fe0f')]
  for (const t of tries) {
    const name = chars[t.join('-')]
    if (name && iconData(name)) return name
  }
  return null
}
function writeSvg(name) {
  if (svgCache.has(name)) return
  const d = iconData(name)
  const w = d.width ?? iconSet.width ?? 16
  const h = d.height ?? iconSet.height ?? 16
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${d.left ?? 0} ${d.top ?? 0} ${w} ${h}">${d.body}</svg>`
  svgCache.set(name, svg)
}

/* ---------- build ---------- */
const problems = []
const warnings = []
const topics = read('topics.csv')
const words = read('words.csv')

const byId = new Map()
for (const t of topics) {
  const where = `topics.csv line ${t._line}`
  if (!t.id) problems.push(`${where}: missing id`)
  if (byId.has(t.id)) problems.push(`${where}: duplicate topic id "${t.id}"`)
  if (!LEVELS.includes(t.level)) problems.push(`${where}: level must be one of ${LEVELS.join(', ')}`)
  if (!TYPES.includes(t.type)) problems.push(`${where}: type must be "words" or "phrases"`)
  if (!t.name_en || !t.name_ar) problems.push(`${where}: name_en and name_ar are required`)
  const iconImg = t.icon ? emojiToIcon(t.icon) : null
  if (iconImg) writeSvg(iconImg)
  byId.set(t.id, {
    order: Number(t.order) || 999,
    id: t.id,
    level: t.level,
    type: t.type,
    icon: t.icon,
    ...(iconImg && { iconImg }),
    name: { ar: t.name_ar, en: t.name_en },
    items: [],
  })
}

const missingPics = new Set()
for (const w of words) {
  const where = `words.csv line ${w._line}`
  const topic = byId.get(w.topic)
  if (!topic) { problems.push(`${where}: unknown topic "${w.topic}"`); continue }
  if (!w.en || !w.ar) { problems.push(`${where}: en and ar are required`); continue }
  const id = w.id || w.en.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
  if (topic.items.some((i) => i.id === id)) problems.push(`${where}: duplicate id "${id}" in topic ${topic.id}`)
  if (topic.items.some((i) => i.ar === w.ar)) warnings.push(`${where}: Arabic "${w.ar}" appears twice in ${topic.id}`)
  if (topic.items.some((i) => i.en.toLowerCase() === w.en.toLowerCase())) warnings.push(`${where}: English "${w.en}" appears twice in ${topic.id}`)
  const pic = w.pic || '❓'
  let img
  if (!pic.startsWith('#') && !pic.startsWith('=')) {
    img = emojiToIcon(pic)
    if (img) writeSvg(img)
    else missingPics.add(`${pic} (${topic.id}/${id})`)
  }
  topic.items.push({ id, pic, ...(img && { img }), en: w.en, ar: w.ar })
}

for (const t of byId.values()) if (!t.items.length) warnings.push(`topic "${t.id}" has no words`)
if (missingPics.size) warnings.push(`no Fluent picture (the emoji itself is shown): ${[...missingPics].join(', ')}`)

if (problems.length) {
  console.error('\n✗ content has problems:\n  ' + problems.join('\n  ') + '\n')
  process.exit(1)
}

const out = [...byId.values()].sort((a, b) => a.order - b.order).map(({ order, ...t }) => t) // eslint-disable-line no-unused-vars
const genDir = join(root, 'src/content/generated')
mkdirSync(genDir, { recursive: true })
writeFileSync(join(genDir, 'topics.json'), JSON.stringify(out))

// Pictures the interface itself uses (activity tabs, badges, home page)
const UI_EMOJIS = ['📖', '❓', '🧩', '🔤', '🎤', '🔥', '⭐', '❤️', '🔁', '🔍', '🏅', '🎯', '🌱', '🚀', '📚', '🏆', '💯', '🗓️', '👣', '💎']
const uiIcons = {}
for (const e of UI_EMOJIS) {
  const name = emojiToIcon(e)
  if (name) {
    writeSvg(name)
    uiIcons[e] = name
  }
}
writeFileSync(join(genDir, 'ui-icons.json'), JSON.stringify(uiIcons))

const picDir = join(root, 'public/pics')
rmSync(picDir, { recursive: true, force: true })
mkdirSync(picDir, { recursive: true })
for (const [name, svg] of svgCache) writeFileSync(join(picDir, `${name}.svg`), svg)

const total = out.reduce((s, t) => s + t.items.length, 0)
if (warnings.length) console.warn('! ' + warnings.join('\n! '))
console.log(`✓ content: ${out.length} topics, ${total} items, ${svgCache.size} pictures`)
