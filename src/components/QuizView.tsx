import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { nextTopic, type Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useProgress } from '../lib/progress'
import { buildQuiz, isListening, starsForScore, type Question } from '../lib/quiz'
import { useSpeak } from '../lib/useSpeak'
import { SpeakerIcon, StarIcon } from './Icons'
import { Pic } from './Pic'
import { btn, card } from './ui'

export function QuizView({ topic }: { topic: Topic }) {
  const [round, setRound] = useState(0)
  // A new set of questions each time the topic changes or "try again" is pressed
  const questions = useMemo(() => buildQuiz(topic), [topic, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)

  const again = () => {
    setIndex(0)
    setScore(0)
    setRound((r) => r + 1)
  }

  if (index >= questions.length) {
    return <Result topic={topic} score={score} total={questions.length} onAgain={again} />
  }

  return (
    <QuestionCard
      key={`${round}-${index}`}
      topic={topic}
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
  topic: Topic
  question: Question
  index: number
  total: number
  autoPlay: boolean
  onAnswered: (right: boolean) => void
  onNext: () => void
}

function QuestionCard({ topic, question: q, index, total, autoPlay, onAnswered, onNext }: QuestionProps) {
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem } = useSpeak()
  const [picked, setPicked] = useState<number | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const done = picked !== null
  const right = done && q.options[picked] === q.item

  const hear = () => speakItem(q.item, topic.id)

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
    onAnswered(q.options[i] === q.item)
    hear()
  }

  const prompt = { 'listen-pic': t.qListenPic, native: t.qNative, 'listen-text': t.qListenText, 'pic-text': t.qPicText }[q.type]
  const picOptions = q.type === 'listen-pic'
  const shortOptions = q.options.every((o) => tgt(o).length < 22)

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="mb-4.5 flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          className="h-3.5 flex-1 overflow-hidden rounded-full bg-track"
        >
          <i className="block h-full rounded-full bg-ok transition-[width]" style={{ width: `${((index + (done ? 1 : 0)) / total) * 100}%` }} />
        </div>
        <span dir="ltr" className="font-[Nunito] font-extrabold text-muted">
          {index + 1} / {total}
        </span>
      </div>

      <div className={`${card} flex flex-col gap-4.5 rounded-[26px] p-6`}>
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
          {(q.type === 'native' || q.type === 'pic-text') && <Pic pic={q.item.pic} size="lg" />}
          {q.type === 'native' && (
            <span lang={native} dir="auto" className="text-[34px] leading-tight font-extrabold">
              {nat(q.item)}
            </span>
          )}
        </div>

        <div className={`grid gap-3 ${picOptions ? 'grid-cols-2' : shortOptions ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {q.options.map((o, i) => {
            const isAnswer = o === q.item
            const state = !done ? 'idle' : isAnswer ? 'ok' : i === picked ? 'bad' : 'idle'
            const cls = {
              idle: 'border-line bg-surface shadow-[0_4px_0_var(--color-line)] enabled:hover:border-primary',
              ok: 'border-ok bg-ok-tint text-ok-ink',
              bad: 'border-bad bg-bad-tint text-bad-ink',
            }[state]
            return (
              <button
                key={o.id}
                type="button"
                disabled={done}
                onClick={() => choose(i)}
                aria-label={picOptions ? t.option(i + 1) : undefined}
                className={`flex min-h-16 cursor-pointer items-center justify-center gap-2.5 rounded-[18px] border-2 px-4 py-3 text-center text-xl font-extrabold disabled:cursor-default ${cls}`}
              >
                {picOptions ? (
                  <Pic pic={o.pic} />
                ) : (
                  <span lang={target} dir="auto">
                    {tgt(o)}
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
            <b className="text-[22px]">{right ? t.correct : t.wrong}</b>
            {!right && (
              <span lang={target} dir="auto" className="text-xl font-extrabold">
                {tgt(q.item)}
              </span>
            )}
            <span dir="auto">
              {!q.item.pic.startsWith('#') && `${q.item.pic} `}
              <span lang={target}>{tgt(q.item)}</span> = <span lang={native}>{nat(q.item)}</span>
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

function Result({ topic, score, total, onAgain }: { topic: Topic; score: number; total: number; onAgain: () => void }) {
  const { t } = useLanguage()
  const { record } = useProgress()
  const stars = starsForScore(score, total)
  const next = nextTopic(topic.id)

  useEffect(() => {
    record(topic.id, stars)
  }, [record, topic.id, stars])

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className={`${card} flex flex-col items-center gap-3.5 rounded-[26px] px-5 py-8 text-center`}>
        <h2 className="font-display m-0 text-[32px]">{t.resultTitle}</h2>
        <div role="img" aria-label={t.stars(stars)} className="flex">
          {[1, 2, 3].map((i) => (
            <StarIcon key={i} on={i <= stars} size={64} />
          ))}
        </div>
        <div dir="ltr" className="font-[Fredoka] text-[56px] leading-none font-semibold">
          {score} / {total}
        </div>
        <p className="m-0 text-[19px]">{stars === 3 ? t.great : stars >= 1 ? t.good : t.keep}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className={btn.primary} onClick={onAgain}>
            {t.again}
          </button>
          <Link to={`/topic/${topic.id}`} className={btn.ghost}>
            {t.backTopic}
          </Link>
          {next ? (
            <Link to={`/topic/${next.id}`} className={btn.sun}>
              {t.nextTopic} <span aria-hidden="true">{next.icon}</span>
            </Link>
          ) : (
            <Link to="/" className={btn.sun}>
              {t.backLevels}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
