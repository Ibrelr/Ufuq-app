import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { TOPICS, topicsForLevel, type LevelId } from '../content'
import { readStorage, writeStorage } from './storage'

/** Best number of stars (0–3) per topic id. Kept in this browser only, until we add accounts. */
type Stars = Record<string, number>

interface ProgressValue {
  stars: (topicId: string) => number
  levelStars: (levelId: LevelId) => { got: number; max: number }
  total: number
  record: (topicId: string, stars: number) => void
}

const ProgressContext = createContext<ProgressValue | null>(null)
const KEY = 'ufuq-stars'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Stars>(() => readStorage<Stars>(KEY, {}))

  const record = useCallback((topicId: string, s: number) => {
    setData((prev) => {
      if ((prev[topicId] ?? 0) >= s) return prev
      const next = { ...prev, [topicId]: s }
      writeStorage(KEY, next)
      return next
    })
  }, [])

  const value = useMemo<ProgressValue>(() => {
    const stars = (id: string) => data[id] ?? 0
    return {
      stars,
      levelStars: (levelId) => {
        const tps = topicsForLevel(levelId)
        return { got: tps.reduce((s, tp) => s + stars(tp.id), 0), max: tps.length * 3 }
      },
      total: TOPICS.reduce((s, tp) => s + stars(tp.id), 0),
      record,
    }
  }, [data, record])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- provider and hook live together on purpose
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
