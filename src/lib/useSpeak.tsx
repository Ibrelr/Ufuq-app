import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { Item, Lang } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { say, stopSpeaking, type SpeechProblem } from './speech'

interface SpeakValue {
  /** Play an item in the language being learned (or the learner's own with `lang`) */
  speakItem: (item: Item, topicId: string, opts?: { slow?: boolean; lang?: Lang; onEnd?: () => void }) => void
  /** Play any text, e.g. a line in a conversation */
  speakText: (text: string, lang: Lang, opts?: { slow?: boolean; gender?: 'm' | 'f'; onEnd?: () => void }) => void
  stop: () => void
  toast: (msg: string) => void
}

const SpeakContext = createContext<SpeakValue | null>(null)

/** Wraps speech with the right language and shows a friendly message when sound is not available. */
export function SpeakProvider({ children }: { children: ReactNode }) {
  const { target, t } = useLanguage()
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const warned = useRef<Partial<Record<string, boolean>>>({})

  const toast = useCallback((msg: string) => {
    setMessage(msg)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(null), 5000)
  }, [])

  const onProblem = useCallback(
    (p: SpeechProblem, lang: Lang) => {
      const key = p + lang
      if (warned.current[key]) return
      warned.current[key] = true
      toast(p === 'no-speech' ? t.noSpeech : t.noVoice[lang])
    },
    [t, toast],
  )

  const speakItem = useCallback<SpeakValue['speakItem']>(
    (item, topicId, opts = {}) => {
      const lang = opts.lang ?? target
      say(item[lang], lang, { slow: opts.slow, topicId, itemId: item.id, onEnd: opts.onEnd, onProblem })
    },
    [target, onProblem],
  )

  const speakText = useCallback<SpeakValue['speakText']>(
    (text, lang, opts = {}) => say(text, lang, { slow: opts.slow, gender: opts.gender, onEnd: opts.onEnd, onProblem }),
    [onProblem],
  )

  return (
    <SpeakContext.Provider value={{ speakItem, speakText, stop: stopSpeaking, toast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-x-4 bottom-20 z-20 sm:bottom-5 mx-auto max-w-lg rounded-2xl bg-ink px-5 py-3.5 text-base font-bold text-white shadow-xl ${message ? '' : 'hidden'}`}
      >
        {message}
      </div>
    </SpeakContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components -- provider and hook live together on purpose
export function useSpeak() {
  const ctx = useContext(SpeakContext)
  if (!ctx) throw new Error('useSpeak must be used inside <SpeakProvider>')
  return ctx
}
