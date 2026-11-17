import { useEffect, useMemo, useRef, useState } from 'react'
import type { GrammarExercise, GrammarLesson } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { shuffle, starsForScore } from '../lib/quiz'
import { useSpeak } from '../lib/useSpeak'
import { useStats, XP_PER_CORRECT } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { SpeakerIcon } from './Icons'
import { ProgressBar } from './ProgressBar'
import { btn, card } from './ui'

/** Gap-fill questions for one grammar lesson. */
export function GrammarPractice({ lesson, onFinish }: { lesson: GrammarLesson; onFinish: () => void }) {
  const { t } = useLanguage()
  const [round, setRound] = useState(0)
  const items = useMemo(() => shuffle(lesson.exercises).map((ex) => ({ ex, options: shuffle([ex.answer, ...ex.wrong]) })), [lesson, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const { finishActivity } = useStats()
  const finished = index >= items.length

  useEffect(() => {
    if (!finished) return
    finishActivity()
    onFinish()
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  if (finished) {
    return (
      <ActivityResult
        stars={starsForScore(score, items.length)}
        score={`${score} / ${items.length}`}
        message={t.practiseDone(score, items.length)}
        onAgain={() => {
          setIndex(0)
          setScore(0)
          setRound((r) => r + 1)
        }}
      />
    )
  }

  return (
    <Question
      key={`${round}-${index}`}
      lessonId={lesson.id}
      ex={items[index].ex}
      options={items[index].options}
      index={index}
      total={items.length}
      onAnswer={(ok) => ok && setScore((s) => s + 1)}
      onNext={() => setIndex((i) => i + 1)}
    />
  )
}

function Question({ lessonId, ex, options, index, total, onAnswer, onNext }: { lessonId: string; ex: GrammarExercise; options: string[]; index: number; total: number; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const { t } = useLanguage()
  const { speakText } = useSpeak()
  const { answer } = useStats()
  const [picked, setPicked] = useState<string | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const done = picked !== null
  const right = picked === ex.answer
  const full = ex.sentence.replace('___', ex.answer)
  const [before, after] = ex.sentence.split('___')

  useEffect(() => {
    if (done) nextRef.current?.focus()
  }, [done])

  const choose = (o: string) => {
    if (done) return
    setPicked(o)
    const ok = o === ex.answer
    onAnswer(ok)
    answer(`grammar:${lessonId}/${index}`, ok, { track: false })
    speakText(full, 'en')
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <ProgressBar value={index + (done ? 1 : 0)} max={total} label={`${index + 1} / ${total}`} />
      <div className={`${card} flex flex-col gap-5 rounded-[26px] p-5 sm:p-6`}>
        <p className="m-0 text-lg font-extrabold text-muted">{t.grammarHint}</p>
        <p lang="en" dir="ltr" className="m-0 rounded-[20px] bg-bg p-5 text-center text-2xl leading-relaxed font-extrabold sm:text-3xl">
          {before}
          <span className={`mx-1 inline-block min-w-20 rounded-lg border-b-4 px-2 ${!done ? 'border-primary text-transparent' : 'border-ok bg-ok-tint text-ok-ink'}`}>
            {done ? ex.answer : '___'}
          </span>
          {after}
        </p>
        <div className={`grid gap-3 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {options.map((o) => {
            const state = !done ? 'idle' : o === ex.answer ? 'ok' : o === picked ? 'bad' : 'idle'
            const cls = {
              idle: 'border-line bg-surface shadow-[0_4px_0_var(--color-line)] enabled:hover:border-primary',
              ok: 'border-ok bg-ok-tint text-ok-ink',
              bad: 'border-bad bg-bad-tint text-bad-ink animate-[shake_.35s_ease-in-out]',
            }[state]
            return (
              <button key={o} type="button" lang="en" dir="ltr" disabled={done} onClick={() => choose(o)} className={`min-h-15 cursor-pointer rounded-[18px] border-2 px-4 py-3 text-xl font-extrabold disabled:cursor-default ${cls}`}>
                {o}
              </button>
            )
          })}
        </div>
        {done && (
          <div role="status" className={`flex flex-col gap-2.5 rounded-[20px] border-2 p-4 ${right ? 'border-ok bg-ok-tint text-ok-ink' : 'border-bad bg-bad-tint text-bad-ink'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="text-xl">{right ? t.correct : t.wrong}</b>
              {right && <span className="rounded-full bg-sun px-3 py-1 text-sm font-extrabold text-ink">{t.xpGain(XP_PER_CORRECT)}</span>}
            </div>
            <span lang="en" dir="ltr" className="text-lg font-extrabold">
              {full}
            </span>
            <span lang="ar" dir="rtl">
              {ex.ar}
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button ref={nextRef} type="button" className={right ? btn.ok : btn.bad} onClick={onNext}>
                {index === total - 1 ? t.seeResult : t.next2}
              </button>
              <button type="button" className={btn.ghost} onClick={() => speakText(full, 'en')}>
                <SpeakerIcon /> {t.hear}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
