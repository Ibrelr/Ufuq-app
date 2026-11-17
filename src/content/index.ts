import levelsJson from './levels.json'
import topicsJson from './generated/topics.json'
import conversationsJson from './generated/conversations.json'
import readingsJson from './generated/readings.json'
import type { Conversation, Level, LevelId, Reading, Topic } from './types'

export * from './types'

export const LEVELS = levelsJson as Level[]

// Generated from content/topics.csv and content/words.csv by `npm run content`
export const TOPICS = topicsJson as Topic[]

export const CONVERSATIONS = conversationsJson as Conversation[]
export const READINGS = readingsJson as Reading[]
export const getConversation = (id: string) => CONVERSATIONS.find((c) => c.id === id)
export const getReading = (id: string) => READINGS.find((r) => r.id === id)
export const conversationsForLevel = (id: LevelId) => CONVERSATIONS.filter((c) => c.level === id)
export const readingsForLevel = (id: LevelId) => READINGS.filter((r) => r.level === id)

export const getLevel = (id: string) => LEVELS.find((l) => l.id === id)
export const getTopic = (id: string) => TOPICS.find((t) => t.id === id)
export const topicsForLevel = (id: LevelId) => TOPICS.filter((t) => t.level === id)
export const nextTopic = (id: string) => {
  const i = TOPICS.findIndex((t) => t.id === id)
  return i >= 0 ? TOPICS[i + 1] : undefined
}

/** Tailwind classes per level, written out in full so Tailwind can find them. */
export const LEVEL_STYLE: Record<LevelId, { bg: string; text: string; border: string }> = {
  a1: { bg: 'bg-a1', text: 'text-a1', border: 'border-a1' },
  a2: { bg: 'bg-a2', text: 'text-a2', border: 'border-a2' },
  b1: { bg: 'bg-b1', text: 'text-b1', border: 'border-b1' },
  b2: { bg: 'bg-b2', text: 'text-b2', border: 'border-b2' },
  c1: { bg: 'bg-c1', text: 'text-c1', border: 'border-c1' },
}
