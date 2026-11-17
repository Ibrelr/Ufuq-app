import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from './storage'

/**
 * Everything that keeps learners coming back, stored in this browser:
 * XP per day (for streaks and the daily goal), saved words, words to review, and words learned.
 * Keys for words are "topicId/itemId".
 */
interface StatsData {
  xpByDay: Record<string, number>
  saved: string[]
  /** Words answered wrong, with how many correct answers are still needed to clear them */
  review: Record<string, number>
  learned: string[]
  lastTopic?: string
  activities: number
}

const EMPTY: StatsData = { xpByDay: {}, saved: [], review: {}, learned: [], activities: 0 }
const KEY = 'ufuq-stats'
export const DAILY_GOAL = 50
export const XP_PER_CORRECT = 10

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function streakFrom(xpByDay: Record<string, number>) {
  const d = new Date()
  // Today doesn't break the streak until it is over
  if (!xpByDay[dayKey(d)]) d.setDate(d.getDate() - 1)
  let n = 0
  while (xpByDay[dayKey(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

interface StatsValue {
  todayXp: number
  totalXp: number
  streak: number
  /** XP for each of the last 7 days, oldest first */
  week: { day: string; xp: number }[]
  saved: Set<string>
  reviewKeys: string[]
  learned: Set<string>
  lastTopic?: string
  activities: number
  isSaved: (key: string) => boolean
  toggleSaved: (key: string) => void
  /** Records one answer in any exercise: XP, learned words and the review list */
  answer: (key: string, correct: boolean) => void
  finishActivity: () => void
  visitTopic: (topicId: string) => void
}

const StatsContext = createContext<StatsValue | null>(null)

export function StatsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StatsData>(() => ({ ...EMPTY, ...readStorage<Partial<StatsData>>(KEY, {}) }))

  const update = useCallback((fn: (d: StatsData) => StatsData) => {
    setData((prev) => {
      const next = fn(prev)
      if (next !== prev) writeStorage(KEY, next)
      return next
    })
  }, [])

  const toggleSaved = useCallback(
    (key: string) =>
      update((d) => ({ ...d, saved: d.saved.includes(key) ? d.saved.filter((k) => k !== key) : [key, ...d.saved] })),
    [update],
  )

  const answer = useCallback(
    (key: string, correct: boolean) =>
      update((d) => {
        const review = { ...d.review }
        if (correct) {
          if (review[key] !== undefined) {
            review[key] -= 1
            if (review[key] <= 0) delete review[key]
          }
          const today = dayKey()
          return {
            ...d,
            review,
            xpByDay: { ...d.xpByDay, [today]: (d.xpByDay[today] ?? 0) + XP_PER_CORRECT },
            learned: d.learned.includes(key) ? d.learned : [...d.learned, key],
          }
        }
        review[key] = 2 // two correct answers in a row clear a word
        return { ...d, review }
      }),
    [update],
  )

  const finishActivity = useCallback(() => update((d) => ({ ...d, activities: d.activities + 1 })), [update])
  const visitTopic = useCallback((topicId: string) => update((d) => (d.lastTopic === topicId ? d : { ...d, lastTopic: topicId })), [update])

  const value = useMemo<StatsValue>(() => {
    const saved = new Set(data.saved)
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const k = dayKey(d)
      return { day: k, xp: data.xpByDay[k] ?? 0 }
    })
    return {
      todayXp: data.xpByDay[dayKey()] ?? 0,
      totalXp: Object.values(data.xpByDay).reduce((a, b) => a + b, 0),
      streak: streakFrom(data.xpByDay),
      week,
      saved,
      reviewKeys: Object.keys(data.review),
      learned: new Set(data.learned),
      lastTopic: data.lastTopic,
      activities: data.activities,
      isSaved: (k) => saved.has(k),
      toggleSaved,
      answer,
      finishActivity,
      visitTopic,
    }
  }, [data, toggleSaved, answer, finishActivity, visitTopic])

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- provider and hook live together on purpose
export function useStats() {
  const ctx = useContext(StatsContext)
  if (!ctx) throw new Error('useStats must be used inside <StatsProvider>')
  return ctx
}
