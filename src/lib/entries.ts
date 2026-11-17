import { TOPICS, type Item, type Topic } from '../content'

/** A word together with the topic it belongs to (needed for audio files and links). */
export interface Entry {
  topic: Topic
  item: Item
}

export const entryKey = (e: { topic: { id: string }; item: { id: string } }) => `${e.topic.id}/${e.item.id}`

export const ALL_ENTRIES: Entry[] = TOPICS.flatMap((topic) => topic.items.map((item) => ({ topic, item })))
const BY_KEY = new Map(ALL_ENTRIES.map((e) => [entryKey(e), e]))

export const entryFromKey = (key: string) => BY_KEY.get(key)
export const entriesFromKeys = (keys: Iterable<string>) => [...keys].map(entryFromKey).filter((e): e is Entry => !!e)
export const topicEntries = (topic: Topic): Entry[] => topic.items.map((item) => ({ topic, item }))

/** Same word for everyone on the same day */
export function wordOfTheDay(date = new Date()): Entry {
  const words = ALL_ENTRIES.filter((e) => e.topic.type === 'words' && !e.item.pic.startsWith('='))
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
  return words[(day * 7919) % words.length]
}
