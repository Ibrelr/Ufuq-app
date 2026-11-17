import { useLanguage } from '../i18n/LanguageProvider'
import { DAILY_GOAL } from '../lib/stats'

/** A ring that fills up as you earn today's XP. */
export function GoalRing({ xp, size = 120 }: { xp: number; size?: number }) {
  const { t } = useLanguage()
  const pct = Math.min(1, xp / DAILY_GOAL)
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={t.goal(Math.min(xp, DAILY_GOAL), DAILY_GOAL)}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-track)" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={pct >= 1 ? 'var(--color-sun)' : 'var(--color-primary)'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" dir="ltr">
        <b className="font-[Fredoka] text-3xl leading-none font-semibold">{Math.min(xp, DAILY_GOAL)}</b>
        <span className="text-sm font-bold text-muted">/ {DAILY_GOAL} XP</span>
      </div>
    </div>
  )
}
