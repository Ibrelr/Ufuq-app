import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { nextTopic, type Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { DAILY_GOAL, useStats } from '../lib/stats'
import { Confetti } from './Confetti'
import { Mascot, StarIcon } from './Icons'
import { TopicIcon } from './Pic'
import { btn, card } from './ui'

interface Props {
  stars?: number
  message: string
  score?: ReactNode
  onAgain: () => void
  /** Shows "back to the lesson" and "next topic" links */
  topic?: Topic
  extra?: ReactNode
}

/** The finish screen every activity shares: confetti, stars, today's goal and where to go next. */
export function ActivityResult({ stars, message, score, onAgain, topic, extra }: Props) {
  const { t } = useLanguage()
  const { todayXp } = useStats()
  const next = topic && nextTopic(topic.id)
  const pct = Math.min(100, Math.round((todayXp / DAILY_GOAL) * 100))

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <Confetti run={stars === undefined || stars > 0} />
      <div className={`${card} flex flex-col items-center gap-3.5 rounded-[26px] px-5 py-8 text-center`}>
        <Mascot size={96} />
        <h2 className="font-display m-0 text-[32px]">{t.wellDone}</h2>
        {stars !== undefined && (
          <div role="img" aria-label={t.stars(stars)} className="flex">
            {[1, 2, 3].map((i) => (
              <StarIcon key={i} on={i <= stars} size={60} />
            ))}
          </div>
        )}
        {score && (
          <div dir="ltr" className="font-[Fredoka] text-5xl leading-none font-semibold">
            {score}
          </div>
        )}
        <p className="m-0 text-[19px]">{message}</p>

        <div className="w-full max-w-sm">
          <div className="mb-1 flex justify-between text-sm font-extrabold text-muted">
            <span>{todayXp >= DAILY_GOAL ? t.goalReached : t.todayTitle}</span>
            <span>{t.goal(Math.min(todayXp, DAILY_GOAL), DAILY_GOAL)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-track" aria-hidden="true">
            <i className="block h-full rounded-full bg-sun transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {extra}

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button type="button" className={btn.primary} onClick={onAgain}>
            {t.again}
          </button>
          {topic && (
            <Link to={`/topic/${topic.id}`} className={btn.ghost}>
              {t.backTopic}
            </Link>
          )}
          {topic &&
            (next ? (
              <Link to={`/topic/${next.id}`} className={btn.sun}>
                {t.nextTopic} <TopicIcon icon={next.icon} iconImg={next.iconImg} className="size-7" />
              </Link>
            ) : (
              <Link to="/" className={btn.sun}>
                {t.backLevels}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
