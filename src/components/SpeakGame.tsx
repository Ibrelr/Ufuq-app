import { useEffect, useMemo, useRef, useState } from 'react'
import type { Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { entryKey, type Entry } from '../lib/entries'
import { similarity } from '../lib/normalize'
import { shuffle } from '../lib/quiz'
import { getRecognition, speechRecognitionSupported, type Recognition } from '../lib/recognition'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { SpeakerIcon } from './Icons'
import { Pic } from './Pic'
import { ProgressBar } from './ProgressBar'
import { btn, card } from './ui'

const ROUNDS = 5

/** Say the word out loud; the browser's speech recognition checks it. */
export function SpeakGame({ pool, topic }: { pool: Entry[]; topic?: Topic }) {
  const { t } = useLanguage()
  const [round, setRound] = useState(0)
  const words = useMemo(() => shuffle(pool).slice(0, ROUNDS), [pool, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const { finishActivity } = useStats()

  if (!speechRecognitionSupported()) {
    return <p className={`${card} mx-auto max-w-3xl p-6 text-lg`}>{t.speakUnsupported}</p>
  }

  const again = () => {
    setIndex(0)
    setScore(0)
    setRound((r) => r + 1)
  }

  if (index >= words.length) {
    return <ActivityResult stars={Math.round((score / Math.max(1, words.length)) * 3)} message={t.speakDone(score, words.length)} score={`${score} / ${words.length}`} onAgain={again} topic={topic} />
  }

  return (
    <SpeakRound
      key={`${round}-${index}`}
      entry={words[index]}
      index={index}
      total={words.length}
      onDone={(ok) => {
        if (ok) setScore((s) => s + 1)
        if (index === words.length - 1) finishActivity()
        setIndex((i) => i + 1)
      }}
    />
  )
}

function SpeakRound({ entry, index, total, onDone }: { entry: Entry; index: number; total: number; onDone: (ok: boolean) => void }) {
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem, stop } = useSpeak()
  const { answer } = useStats()
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState<string | null>(null)
  const [result, setResult] = useState<null | boolean>(null)
  const [error, setError] = useState<string | null>(null)
  const rec = useRef<Recognition | null>(null)
  const word = tgt(entry.item)

  useEffect(() => () => rec.current?.abort(), [])

  const hear = () => speakItem(entry.item, entry.topic.id)

  const listen = () => {
    const Ctor = getRecognition()
    if (!Ctor) return
    stop()
    setError(null)
    const r = new Ctor()
    r.lang = target === 'en' ? 'en-US' : 'ar-SA'
    r.interimResults = false
    r.maxAlternatives = 5
    r.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript)
      const best = alts.reduce((b, a) => (similarity(a, word) > similarity(b, word) ? a : b), alts[0] ?? '')
      const ok = similarity(best, word) >= (word.includes(' ') ? 0.7 : 0.75)
      setHeard(best)
      if (ok) {
        setResult(true)
        answer(entryKey(entry), true)
      } else setResult(false)
    }
    r.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') setError(t.speakNetwork)
    }
    r.onend = () => setListening(false)
    rec.current = r
    setListening(true)
    setResult(null)
    setHeard(null)
    try {
      r.start()
    } catch {
      setListening(false)
      setError(t.speakNetwork)
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <ProgressBar value={index + (result ? 1 : 0)} max={total} label={`${index + 1} / ${total}`} />
      <div className={`${card} flex flex-col items-center gap-5 rounded-[26px] p-5 text-center sm:p-6`}>
        <p className="m-0 self-stretch text-start text-lg font-extrabold text-muted">{t.speakHint}</p>
        <Pic item={entry.item} size="lg" />
        <div className="flex flex-col items-center gap-1">
          <span lang={target} dir="auto" className="text-3xl font-extrabold sm:text-4xl">
            {word}
          </span>
          <span lang={native} dir="auto" className="text-lg text-muted">
            {nat(entry.item)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className={btn.ghost} onClick={hear}>
            <SpeakerIcon /> {t.hear}
          </button>
          <button
            type="button"
            onClick={listen}
            disabled={listening}
            aria-label={t.speakTap}
            className={`relative flex size-22 cursor-pointer items-center justify-center rounded-full border-0 text-white shadow-[0_5px_0_var(--color-bad-ink)] ${listening ? 'bg-bad animate-pulse' : 'bg-bad'}`}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
            </svg>
          </button>
        </div>
        <span aria-live="polite" className="min-h-7 font-extrabold text-muted">
          {listening ? t.listening : heard === null ? t.speakTap : ''}
        </span>

        {error && <p className="m-0 rounded-2xl bg-bad-tint p-3 text-bad-ink">{error}</p>}

        {heard !== null && (
          <div role="status" className={`flex w-full flex-col items-center gap-3 rounded-[20px] border-2 p-4 ${result ? 'border-ok bg-ok-tint text-ok-ink' : 'border-sun bg-sun-tint text-sun-ink'}`}>
            <span>
              {t.heard}{' '}
              <b lang={target} dir="auto">
                «{heard}»
              </b>
            </span>
            <b className="text-xl">{result ? t.speakGood : t.speakTry}</b>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {result ? (
            <button type="button" className={btn.ok} onClick={() => onDone(true)}>
              {index === total - 1 ? t.seeResult : t.next2}
            </button>
          ) : (
            <button type="button" className="cursor-pointer border-0 bg-transparent p-3 font-extrabold text-primary-dark underline" onClick={() => onDone(false)}>
              {t.skip}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
