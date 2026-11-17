import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Speaker, Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { buildSentenceQuiz, type PracticeSentence, type SentenceQuestion, type SentenceQuestionType } from '../lib/sentences'
import { starsForScore } from '../lib/quiz'
import { useSpeak } from '../lib/useSpeak'
import { useStats, XP_PER_CORRECT } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { SpeakerIcon } from './Icons'
import { TopicIcon } from './Pic'
import { ProgressBar } from './ProgressBar'
import { btn, card } from './ui'

interface Props {
  sentences: PracticeSentence[]
  types: SentenceQuestionType[]
  speakers?: Speaker[]
  /** Answers on topic sentences go to the review list; conversation/text sentences give XP only */
  track?: boolean
  topic?: Topic
  onFinish?: (score: number, total: number) => void
}

export function SentencePractice({ sentences, types, speakers, track = false, topic, onFinish }: Props) {
  const { t, target, native } = useLanguage()
  const [round, setRound] = useState(0)
  const questions = useMemo(() => buildSentenceQuiz(sentences, target, native, types), [sentences, target, native, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const { finishActivity } = useStats()
  const finished = index >= questions.length

  useEffect(() => {
    if (!finished) return
    finishActivity()
    onFinish?.(score, questions.length)
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  if (finished) {
    return (
      <ActivityResult
        stars={starsForScore(score, questions.length)}
        score={`${score} / ${questions.length}`}
        message={t.practiseDone(score, questions.length)}
        onAgain={() => {
          setIndex(0)
          setScore(0)
          setRound((r) => r + 1)
        }}
        topic={topic}
      />
    )
  }

  return (
    <QuestionView
      key={`${round}-${index}`}
      q={questions[index]}
      index={index}
      total={questions.length}
      speakers={speakers}
      track={track}
      onAnswer={(ok) => ok && setScore((s) => s + 1)}
      onNext={() => setIndex((i) => i + 1)}
    />
  )
}

interface QProps {
  q: SentenceQuestion
  index: number
  total: number
  speakers?: Speaker[]
  track: boolean
  onAnswer: (ok: boolean) => void
  onNext: () => void
}

function QuestionView({ q, index, total, speakers, track, onAnswer, onNext }: QProps) {
  const { t, target, native, name } = useLanguage()
  const { speakText } = useSpeak()
  const { answer } = useStats()
  const [result, setResult] = useState<null | boolean>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [placed, setPlaced] = useState<number[]>([])
  const nextRef = useRef<HTMLButtonElement>(null)
  const dir = target === 'ar' ? 'rtl' : 'ltr'
  const text = q.sentence[target]

  const hear = () => speakText(text, target, { gender: q.sentence.speaker?.gender })

  useEffect(() => {
    if (result !== null) nextRef.current?.focus()
  }, [result])

  const finish = (ok: boolean) => {
    setResult(ok)
    onAnswer(ok)
    answer(q.sentence.key, ok, { track })
    hear()
  }

  const prompt = { build: t.buildHint, gap: t.gapHint, meaning: t.meaningHint, who: t.whoSaid }[q.type]
  const built = placed.map((i) => q.options[i]).join(' ')

  const optionBtn = (value: string, label: ReactNode, lang?: string) => {
    const isAnswer = value === q.answer
    const state = result === null ? 'idle' : isAnswer ? 'ok' : picked === value ? 'bad' : 'idle'
    const cls = {
      idle: 'border-line bg-surface shadow-[0_4px_0_var(--color-line)] enabled:hover:border-primary',
      ok: 'border-ok bg-ok-tint text-ok-ink',
      bad: 'border-bad bg-bad-tint text-bad-ink animate-[shake_.35s_ease-in-out]',
    }[state]
    return (
      <button
        key={value}
        type="button"
        lang={lang}
        dir="auto"
        disabled={result !== null}
        onClick={() => {
          setPicked(value)
          finish(isAnswer)
        }}
        className={`flex min-h-15 cursor-pointer items-center justify-center gap-2 rounded-[18px] border-2 px-4 py-3 text-center text-lg font-extrabold disabled:cursor-default ${cls}`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <ProgressBar value={index + (result !== null ? 1 : 0)} max={total} label={`${index + 1} / ${total}`} />
      <div className={`${card} flex flex-col gap-5 rounded-[26px] p-5 sm:p-6`}>
        <p className="m-0 text-lg font-extrabold text-muted">{prompt}</p>

        {/* What the question shows */}
        <div className="flex flex-col items-center gap-3 rounded-[20px] bg-bg p-4 text-center">
          {q.type === 'build' && (
            <span lang={native} dir="auto" className="text-xl font-bold">
              {q.sentence[native]}
            </span>
          )}
          {q.type === 'gap' && (
            <span lang={target} dir="auto" className="text-2xl leading-relaxed font-extrabold">
              {q.prompt}
            </span>
          )}
          {(q.type === 'meaning' || q.type === 'who') && (
            <span lang={target} dir="auto" className="text-2xl leading-relaxed font-extrabold">
              {text}
            </span>
          )}
          <button type="button" onClick={hear} className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent font-extrabold text-primary-dark">
            <SpeakerIcon size={20} /> {t.hear}
          </button>
        </div>

        {/* Put the words in order */}
        {q.type === 'build' && (
          <>
            <div
              lang={target}
              dir={dir}
              aria-live="polite"
              className={`flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3 ${
                result === null ? 'border-line' : result ? 'border-ok bg-ok-tint' : 'border-bad bg-bad-tint'
              }`}
            >
              {placed.map((i) => (
                <button
                  key={i}
                  type="button"
                  disabled={result !== null}
                  onClick={() => setPlaced((p) => p.filter((x) => x !== i))}
                  className="cursor-pointer rounded-xl border-2 border-primary bg-tint px-3 py-2 text-lg font-extrabold text-primary-dark"
                >
                  {q.options[i]}
                </button>
              ))}
            </div>
            <div lang={target} dir={dir} className="flex flex-wrap justify-center gap-2">
              {q.options.map((w, i) => {
                const used = placed.includes(i)
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={used || result !== null}
                    onClick={() => setPlaced((p) => [...p, i])}
                    className={`min-h-12 cursor-pointer rounded-xl border-2 px-3 py-2 text-lg font-extrabold ${
                      used ? 'border-line bg-track text-transparent' : 'border-line bg-surface shadow-[0_3px_0_var(--color-line)] hover:border-primary'
                    }`}
                  >
                    {w}
                  </button>
                )
              })}
            </div>
            {result === null && (
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" className={btn.sun} disabled={placed.length !== q.options.length} onClick={() => finish(built === q.answer)}>
                  {t.check}
                </button>
                <button type="button" className={btn.ghost} onClick={() => setPlaced([])}>
                  {t.clear}
                </button>
              </div>
            )}
          </>
        )}

        {q.type === 'gap' && <div className="grid grid-cols-2 gap-3">{q.options.map((o) => optionBtn(o, o, target))}</div>}
        {q.type === 'meaning' && <div className="grid grid-cols-1 gap-3">{q.options.map((o) => optionBtn(o, o, native))}</div>}
        {q.type === 'who' && speakers && (
          <div className="grid grid-cols-2 gap-3">
            {speakers.map((sp) =>
              optionBtn(
                sp.id,
                <>
                  <TopicIcon icon={sp.icon} iconImg={sp.iconImg} className="size-10" />
                  <span className="flex flex-col">
                    <span>{name(sp.name)}</span>
                    <small className="font-bold opacity-75">{name(sp.role)}</small>
                  </span>
                </>,
              ),
            )}
          </div>
        )}

        {result !== null && (
          <div role="status" className={`flex flex-col gap-2.5 rounded-[20px] border-2 p-4 ${result ? 'border-ok bg-ok-tint text-ok-ink' : 'border-bad bg-bad-tint text-bad-ink'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="text-xl">{result ? t.correct : t.wrong}</b>
              {result && <span className="rounded-full bg-sun px-3 py-1 text-sm font-extrabold text-ink">{t.xpGain(XP_PER_CORRECT)}</span>}
            </div>
            <span lang={target} dir="auto" className="text-lg font-extrabold">
              {text}
            </span>
            <span lang={native} dir="auto">
              {q.sentence[native]}
            </span>
            <button ref={nextRef} type="button" className={`${result ? btn.ok : btn.bad} self-start`} onClick={onNext}>
              {index === total - 1 ? t.seeResult : t.next2}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
