import { Link } from 'react-router-dom'
import { LEVEL_STYLE, type GrammarLesson } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useStats } from '../lib/stats'
import { TopicIcon } from './Pic'

export function GrammarCard({ lesson }: { lesson: GrammarLesson }) {
  const { t, name } = useLanguage()
  const { isDone } = useStats()
  const done = isDone(`grammar:${lesson.id}`)
  return (
    <Link to={`/grammar/${lesson.id}`} className="relative flex items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4 text-ink no-underline shadow-[0_4px_0_var(--color-line)] hover:border-primary">
      {done && <span className="absolute end-3 top-3 rounded-full bg-ok-tint px-2 py-0.5 text-xs font-extrabold text-ok-ink">✓ {t.finished}</span>}
      <TopicIcon icon={lesson.icon} iconImg={lesson.iconImg} className="size-12 flex-none" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className={`${LEVEL_STYLE[lesson.level].bg} rounded-md px-1.5 font-[Fredoka] text-sm font-semibold text-white`}>{lesson.level.toUpperCase()}</span>
          <span className="text-sm font-bold text-muted">{t.exercisesN(lesson.exercises.length)}</span>
        </span>
        <b className="font-display pe-16 text-lg leading-tight">{name(lesson.title)}</b>
        <span lang="en" dir="ltr" className="truncate text-start text-sm text-muted">
          {lesson.examples[0]?.en}
        </span>
      </div>
    </Link>
  )
}
