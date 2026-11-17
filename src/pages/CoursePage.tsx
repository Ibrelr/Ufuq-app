import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LEVELS, LEVEL_STYLE, type LevelId } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useCourse } from '../lib/useCourse'
import type { StepKind } from '../lib/path'
import { Confetti } from '../components/Confetti'
import { Mascot } from '../components/Icons'
import { TopicIcon } from '../components/Pic'

const KIND_STYLE: Record<StepKind, string> = {
  words: 'bg-sun-tint text-sun-ink',
  phrases: 'bg-tint text-primary-dark',
  grammar: 'bg-[#EDE9FC] text-[#4329B0]',
  talk: 'bg-ok-tint text-ok-ink',
  read: 'bg-[#E0F2F3] text-[#0A5C63]',
}

/** The learning path for one level, drawn as a winding trail of steps. */
export function CoursePage() {
  const { t, name } = useLanguage()
  const [params, setParams] = useSearchParams()
  const all = useCourse()
  const firstOpen = (all.next?.level ?? 'a1') as LevelId
  const [level, setLevel] = useState<LevelId>((params.get('level') as LevelId) || firstOpen)
  const { steps, isStepDone, next, done, total } = useCourse(level)
  const finished = total > 0 && done === total

  return (
    <>
      <div className="flex items-center gap-4 pt-8 pb-2">
        <Mascot size={64} />
        <div>
          <h1 className="font-display m-0 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{t.courseTitle}</h1>
          <p className="m-0 text-muted">{t.courseText}</p>
        </div>
      </div>

      <div role="tablist" className="my-5 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={level === l.id}
            onClick={() => {
              setLevel(l.id)
              setParams({ level: l.id }, { replace: true })
            }}
            className={`min-h-12 cursor-pointer rounded-2xl border-2 px-4 font-extrabold ${level === l.id ? `${LEVEL_STYLE[l.id].bg} border-transparent text-white` : 'border-line bg-surface text-ink'}`}
          >
            <span className="font-[Fredoka]">{l.code}</span> <span className="hidden sm:inline">· {name(l.name)}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-track">
          <i className={`${LEVEL_STYLE[level].bg} block h-full rounded-full`} style={{ width: `${(done / Math.max(1, total)) * 100}%` }} />
        </div>
        <span className="font-extrabold text-muted">{t.stepsDone(done, total)}</span>
      </div>

      {finished && (
        <div className="mb-6 rounded-3xl border-2 border-sun bg-sun-tint p-5 text-center text-xl font-extrabold">
          <Confetti /> 🎉 {t.levelDone}
        </div>
      )}

      <ol className="m-0 flex list-none flex-col items-center gap-2 p-0 pb-16">
        {steps.map((s, i) => {
          const isDone = isStepDone(s)
          const isNext = next?.key === s.key
          // A gentle zig-zag, like a path up a hill
          const offset = [0, 60, 90, 60, 0, -60, -90, -60][i % 8]
          return (
            <li key={s.key} className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
              {isNext && <span className="mb-1 animate-bounce rounded-xl bg-ink px-3 py-1 text-sm font-extrabold text-white">{t.startStep}</span>}
              <Link
                to={s.to}
                aria-label={`${t.stepKind[s.kind]}: ${name(s.title)}${isDone ? ' ✓' : ''}`}
                className={`relative flex size-20 items-center justify-center rounded-full border-4 no-underline transition sm:size-22 ${
                  isDone ? 'border-ok bg-ok-tint' : isNext ? 'border-sun bg-surface shadow-[0_6px_0_var(--color-sun-dark)]' : 'border-line bg-surface shadow-[0_6px_0_var(--color-line)]'
                }`}
              >
                <TopicIcon icon={s.icon} iconImg={s.iconImg} className="size-11" />
                {isDone && <span className="absolute -end-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-ok text-sm font-extrabold text-white">✓</span>}
              </Link>
              <span className="mt-1.5 max-w-44 text-center text-sm leading-tight font-extrabold">{name(s.title)}</span>
              <span className={`mt-1 mb-3 rounded-full px-2 py-0.5 text-xs font-extrabold ${KIND_STYLE[s.kind]}`}>{t.stepKind[s.kind]}</span>
            </li>
          )
        })}
      </ol>
    </>
  )
}
