import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LEVELS, LEVEL_STYLE, TOPICS } from '../content'
import type { BadgeId } from '../i18n/strings'
import { useLanguage } from '../i18n/LanguageProvider'
import { ALL_ENTRIES } from '../lib/entries'
import { useProgress } from '../lib/progress'
import { DAILY_GOAL, useStats } from '../lib/stats'
import { FlameIcon, StarIcon } from '../components/Icons'
import { UiIcon } from '../components/Pic'
import { GoalRing } from '../components/GoalRing'
import { card } from '../components/ui'

const BADGES: { id: BadgeId; emoji: string }[] = [
  { id: 'first', emoji: '👣' },
  { id: 'streak3', emoji: '🔥' },
  { id: 'streak7', emoji: '🗓️' },
  { id: 'words50', emoji: '🌱' },
  { id: 'words200', emoji: '📚' },
  { id: 'stars30', emoji: '⭐' },
  { id: 'saved10', emoji: '❤️' },
  { id: 'xp1000', emoji: '💎' },
]

export function ProgressPage() {
  const { t, name } = useLanguage()
  const { todayXp, totalXp, streak, week, learned, saved, activities } = useStats()
  const { total: stars, levelStars } = useProgress()
  const maxStars = TOPICS.length * 3

  const earned: Record<BadgeId, boolean> = {
    first: activities > 0,
    streak3: streak >= 3,
    streak7: streak >= 7,
    words50: learned.size >= 50,
    words200: learned.size >= 200,
    stars30: stars >= 30,
    saved10: saved.size >= 10,
    xp1000: totalXp >= 1000,
  }
  const maxWeek = Math.max(DAILY_GOAL, ...week.map((d) => d.xp))

  const tile = (icon: ReactNode, value: ReactNode, labelText: string) => (
    <div className={`${card} flex items-center gap-3.5 p-5`}>
      {icon}
      <div className="flex flex-col">
        <b dir="ltr" className="text-start font-[Fredoka] text-3xl leading-none font-semibold">
          {value}
        </b>
        <span className="text-[15px] font-bold text-muted">{labelText}</span>
      </div>
    </div>
  )

  return (
    <>
      <h1 className="font-display mt-8 mb-5 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{t.progressTitle}</h1>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className={`${card} flex flex-col items-center gap-3 p-6 text-center`}>
          <GoalRing xp={todayXp} size={150} />
          <b className="text-lg">{todayXp >= DAILY_GOAL ? t.goalReached : t.todayTitle}</b>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tile(<FlameIcon size={44} lit={streak > 0} />, streak, t.streakLabel)}
          {tile(<UiIcon emoji="💎" className="size-11" />, totalXp, t.totalXp)}
          {tile(<UiIcon emoji="🌱" className="size-11" />, `${learned.size} / ${ALL_ENTRIES.length}`, t.learnedWords)}
          {tile(<StarIcon on size={44} />, `${stars} / ${maxStars}`, t.starsEarned)}
        </div>
      </div>

      <section className={`${card} mt-4 p-6`}>
        <h2 className="font-display mt-0 mb-4 text-2xl">{t.weekTitle}</h2>
        <div className="flex h-40 items-end gap-2 sm:gap-4" dir="ltr">
          {week.map((d) => {
            const date = new Date(d.day + 'T12:00:00')
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-extrabold text-muted">{d.xp || ''}</span>
                <div
                  className={`w-full max-w-12 rounded-t-lg ${d.xp >= DAILY_GOAL ? 'bg-sun' : d.xp ? 'bg-primary' : 'bg-track'}`}
                  style={{ height: `${Math.max(6, (d.xp / maxWeek) * 110)}px` }}
                  title={`${d.xp} XP`}
                />
                <span className="text-xs font-bold text-muted">{t.weekdays[date.getDay()]}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className={`${card} mt-4 p-6`}>
        <h2 className="font-display mt-0 mb-4 text-2xl">{t.achievements}</h2>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
          {BADGES.map((b) => {
            const on = earned[b.id]
            const [title, desc] = t.badges[b.id]
            return (
              <li key={b.id} className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 text-center ${on ? 'border-sun bg-sun-tint' : 'border-line bg-bg'}`}>
                <span className={on ? '' : 'opacity-35 grayscale'}>
                  <UiIcon emoji={b.emoji} className="size-12" />
                </span>
                <b className="text-base">{title}</b>
                <span className="text-sm text-muted">{desc}</span>
                <span className="sr-only">{on ? '✓' : ''}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={`${card} mt-4 mb-12 p-6`}>
        <h2 className="font-display mt-0 mb-4 text-2xl">{t.levelsTitle}</h2>
        <div className="flex flex-col gap-3">
          {LEVELS.map((l) => {
            const { got, max } = levelStars(l.id)
            return (
              <Link key={l.id} to={`/level/${l.id}`} className="flex items-center gap-3 text-ink no-underline">
                <span className={`${LEVEL_STYLE[l.id].bg} w-12 rounded-lg py-1 text-center font-[Fredoka] font-semibold text-white`}>{l.code}</span>
                <span className="w-36 truncate font-bold">{name(l.name)}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-track">
                  <i className={`${LEVEL_STYLE[l.id].bg} block h-full rounded-full`} style={{ width: `${(got / max) * 100}%` }} />
                </div>
                <span dir="ltr" className="w-16 text-end text-sm font-extrabold text-muted">
                  {got}/{max}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
