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

function pickVoice(lang: Lang) {
  if (!voices.length) refreshVoices()
  for (const p of VOICE_PREFS[lang]) {
    const v = voices.find((v) => v.lang?.replace('_', '-').toLowerCase().startsWith(p))
    if (v) return v
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
  const v = pickVoice(lang)
  if (v) u.voice = v
  else if (voices.length) opts.onProblem?.('no-voice', lang)
  u.rate = opts.slow ? 0.55 : 0.85
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
