import type { Lang } from '../content'

/**
 * Plays a word or sentence.
 *
 * 1. If a recorded file exists (listed in /audio/manifest.json), it plays that file.
 *    Files live at public/audio/{lang}/{topicId}/{itemId}.mp3.
 * 2. Otherwise it falls back to the browser's speech synthesis (Web Speech API).
 *
 * Recorded audio is the long-term plan, because many phones have no Arabic voice.
 */

export type SpeechProblem = 'no-speech' | 'no-voice'

export interface SayOptions {
  slow?: boolean
  /** In conversations, each speaker gets a different voice (or pitch) */
  gender?: 'm' | 'f'
  /** Used to find a recorded file */
  topicId?: string
  itemId?: string
  onEnd?: () => void
  onProblem?: (p: SpeechProblem, lang: Lang) => void
}

let manifest: Set<string> | null = null
let manifestLoading: Promise<void> | null = null

export function loadAudioManifest() {
  if (!manifestLoading) {
    manifestLoading = fetch('/audio/manifest.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: string[]) => {
        manifest = new Set(list)
      })
      .catch(() => {
        manifest = new Set()
      })
  }
  return manifestLoading
}

const hasSynth = () => typeof window !== 'undefined' && 'speechSynthesis' in window

let voices: SpeechSynthesisVoice[] = []
function refreshVoices() {
  try {
    voices = window.speechSynthesis.getVoices() ?? []
  } catch {
    voices = []
  }
}
if (hasSynth()) {
  refreshVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
}

const VOICE_PREFS: Record<Lang, string[]> = {
  en: ['en-us', 'en-gb', 'en'],
  ar: ['ar-sa', 'ar-sy', 'ar-eg', 'ar'],
}

const FEMALE = /female|woman|zira|samantha|karen|moira|tessa|fiona|victoria|susan|hazel|libby|sonia|salma|zariyah|laila|hoda|amina|mariam|sara/i
const MALE = /\bmale\b|\bman\b|david|daniel|alex|fred|george|ryan|guy|mark|tarik|maged|hamed|naayf|omar|shakir|majed/i

function pickVoice(lang: Lang, gender?: 'm' | 'f') {
  if (!voices.length) refreshVoices()
  for (const p of VOICE_PREFS[lang]) {
    const matching = voices.filter((v) => v.lang?.replace('_', '-').toLowerCase().startsWith(p))
    if (!matching.length) continue
    if (gender) {
      const want = gender === 'f' ? FEMALE : MALE
      const avoid = gender === 'f' ? MALE : FEMALE
      const byName = matching.find((v) => want.test(v.name) && !(gender === 'f' && /\bmale\b/i.test(v.name)))
      if (byName) return { voice: byName, exact: true }
      // No named match: use different voices for the two speakers when there are several
      const others = matching.filter((v) => !avoid.test(v.name))
      const pick = (others.length ? others : matching)[gender === 'f' ? 0 : Math.min(1, (others.length ? others : matching).length - 1)]
      return { voice: pick, exact: false }
    }
    return { voice: matching[0], exact: true }
  }
  return null
}

let currentAudio: HTMLAudioElement | null = null

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if (hasSynth()) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
  }
}

function speakSynth(text: string, lang: Lang, opts: SayOptions) {
  if (!hasSynth()) {
    opts.onProblem?.('no-speech', lang)
    opts.onEnd?.()
    return
  }
  const u = new SpeechSynthesisUtterance(text.replace(/…/g, '').trim())
  u.lang = lang === 'en' ? 'en-US' : 'ar-SA'
  const v = pickVoice(lang, opts.gender)
  if (v) u.voice = v.voice
  else if (voices.length) opts.onProblem?.('no-voice', lang)
  u.rate = opts.slow ? 0.55 : 0.85
  // Without a voice that matches, a higher or lower pitch still tells the speakers apart
  if (opts.gender && !v?.exact) u.pitch = opts.gender === 'f' ? 1.25 : 0.8
  if (opts.onEnd) {
    u.onend = () => opts.onEnd?.()
    u.onerror = () => opts.onEnd?.()
  }
  window.speechSynthesis.speak(u)
}

export function say(text: string, lang: Lang, opts: SayOptions = {}) {
  stopSpeaking()
  const key = opts.topicId && opts.itemId ? `${lang}/${opts.topicId}/${opts.itemId}` : null
  if (key && manifest?.has(key)) {
    const audio = new Audio(`/audio/${key}.mp3`)
    audio.playbackRate = opts.slow ? 0.7 : 1
    audio.onended = () => opts.onEnd?.()
    currentAudio = audio
    audio.play().catch(() => speakSynth(text, lang, opts))
    return
  }
  speakSynth(text, lang, opts)
}
