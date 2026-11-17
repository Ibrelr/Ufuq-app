import { useEffect, useMemo, useRef, useState } from 'react'
import type { Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { entryKey, type Entry } from '../lib/entries'
import { useProgress } from '../lib/progress'
import { buildQuiz, isListening, starsForScore, type Question } from '../lib/quiz'
import { useSpeak } from '../lib/useSpeak'
import { useStats, XP_PER_CORRECT } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { SpeakerIcon } from './Icons'
import { Pic } from './Pic'
import { ProgressBar } from './ProgressBar'
import { btn, card } from './ui'

interface Props {
  pool: Entry[]
  /** When set, the result is saved as stars for this topic */
  topic?: Topic
}

export function QuizView({ pool, topic }: Props) {
  const [round, setRound] = useState(0)
  const questions = useMemo(() => buildQuiz(pool), [pool, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const { t } = useLanguage()
  const { record } = useProgress()
  const { finishActivity } = useStats()

  const again = () => {
    setIndex(0)
    setScore(0)
    setRound((r) => r + 1)
  }

  const finished = index >= questions.length
  const stars = starsForScore(score, questions.length)

  useEffect(() => {
    if (!finished) return
    finishActivity()
    if (topic) record(topic.id, stars)
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  if (finished) {
    return (
      <ActivityResult
        stars={stars}
        score={`${score} / ${questions.length}`}
        message={stars === 3 ? t.great : stars >= 1 ? t.good : t.keep}
        onAgain={again}
        topic={topic}
      />
    )
  }

  return (
    <QuestionCard
      key={`${round}-${index}`}
      question={questions[index]}
      index={index}
      total={questions.length}
      autoPlay={index > 0}
      onAnswered={(right) => right && setScore((s) => s + 1)}
      onNext={() => setIndex((i) => i + 1)}
    />
  )
}

interface QuestionProps {
  question: Question
  index: number
  total: number
  autoPlay: boolean
  onAnswered: (right: boolean) => void
  onNext: () => void
}

function QuestionCard({ question: q, index, total, autoPlay, onAnswered, onNext }: QuestionProps) {
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem } = useSpeak()
  const { answer } = useStats()
  const [picked, setPicked] = useState<number | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const done = picked !== null
  const right = done && q.options[picked] === q.entry
  const { item } = q.entry

  const hear = () => speakItem(item, q.entry.topic.id)

  // Listening questions play by themselves after "next" (the click lets the browser play sound)
  useEffect(() => {
    if (autoPlay && isListening(q.type)) hear()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (done) nextRef.current?.focus()
  }, [done])

  const choose = (i: number) => {
    if (done) return
    setPicked(i)
    const ok = q.options[i] === q.entry
    onAnswered(ok)
    answer(entryKey(q.entry), ok)
    hear()
  }

  const prompt = { 'listen-pic': t.qListenPic, native: t.qNative, 'listen-text': t.qListenText, 'pic-text': t.qPicText }[q.type]
  const picOptions = q.type === 'listen-pic'
  const shortOptions = q.options.every((o) => tgt(o.item).length < 22)

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <ProgressBar value={index + (done ? 1 : 0)} max={total} label={`${index + 1} / ${total}`} />

      <div className={`${card} flex flex-col gap-4.5 rounded-[26px] p-5 sm:p-6`}>
        <p className="m-0 text-xl font-extrabold text-muted">{prompt}</p>

        <div className="flex min-h-28 flex-wrap items-center justify-center gap-4.5 rounded-[20px] bg-bg p-4.5 text-center">
          {isListening(q.type) && (
            <button
              type="button"
              onClick={hear}
              aria-label={t.playAgain}
              className="flex size-22 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-white shadow-[0_5px_0_var(--color-primary-dark)] active:translate-y-1"
            >
              <SpeakerIcon size={40} />
            </button>
          )}
          {(q.type === 'native' || q.type === 'pic-text') && <Pic item={item} size="lg" />}
          {q.type === 'native' && (
            <span lang={native} dir="auto" className="text-[30px] leading-tight font-extrabold sm:text-[34px]">
              {nat(item)}
            </span>
          )}
        </div>

        <div className={`grid gap-3 ${picOptions ? 'grid-cols-2' : shortOptions ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {q.options.map((o, i) => {
            const isAnswer = o === q.entry
            const state = !done ? 'idle' : isAnswer ? 'ok' : i === picked ? 'bad' : 'idle'
            const cls = {
              idle: 'border-line bg-surface shadow-[0_4px_0_var(--color-line)] enabled:hover:border-primary',
              ok: 'border-ok bg-ok-tint text-ok-ink animate-[pop_.35s_ease-out]',
              bad: 'border-bad bg-bad-tint text-bad-ink animate-[shake_.35s_ease-in-out]',
            }[state]
            return (
              <button
                key={entryKey(o)}
                type="button"
                disabled={done}
                onClick={() => choose(i)}
                aria-label={picOptions ? t.option(i + 1) : undefined}
                className={`flex min-h-16 cursor-pointer items-center justify-center gap-2.5 rounded-[18px] border-2 px-4 py-3 text-center text-xl font-extrabold disabled:cursor-default ${cls}`}
              >
                {picOptions ? (
                  <Pic item={o.item} />
                ) : (
                  <span lang={target} dir="auto">
                    {tgt(o.item)}
                  </span>
                )}
                {state === 'ok' && <span className="text-sm">{t.ok}</span>}
                {state === 'bad' && <span className="text-sm">{t.bad}</span>}
              </button>
            )
          })}
        </div>

        {done && (
          <div role="status" className={`flex flex-col gap-3 rounded-[20px] border-2 p-4.5 ${right ? 'border-ok bg-ok-tint text-ok-ink' : 'border-bad bg-bad-tint text-bad-ink'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="text-[22px]">{right ? t.correct : t.wrong}</b>
              {right && <span className="rounded-full bg-sun px-3 py-1 text-sm font-extrabold text-ink">{t.xpGain(XP_PER_CORRECT)}</span>}
            </div>
            {!right && (
              <span lang={target} dir="auto" className="text-xl font-extrabold">
                {tgt(item)}
              </span>
            )}
            <span dir="auto">
              <span lang={target}>{tgt(item)}</span> = <span lang={native}>{nat(item)}</span>
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button ref={nextRef} type="button" className={right ? btn.ok : btn.bad} onClick={onNext}>
                {index === total - 1 ? t.seeResult : t.next}
              </button>
              <button type="button" className={btn.ghost} onClick={hear}>
                <SpeakerIcon /> {t.hear}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
