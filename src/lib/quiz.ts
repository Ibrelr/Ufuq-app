import type { Entry } from './entries'

export type QuestionType = 'listen-pic' | 'native' | 'pic-text' | 'listen-text'

export interface Question {
  entry: Entry
  type: QuestionType
  options: Entry[]
}

export const QUIZ_LENGTH = 8

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Entries whose picture can stand for the word: no other entry in the pool shares it,
 * it doesn't spell out the answer, and the word is a word (not a sentence).
 * Days of the week, for example, all use 📅.
 */
export function pictureEntries(pool: Entry[]) {
  const count = new Map<string, number>()
  for (const e of pool) count.set(e.item.pic, (count.get(e.item.pic) ?? 0) + 1)
  return pool.filter((e) => count.get(e.item.pic) === 1 && !e.item.pic.startsWith('=') && e.topic.type === 'words')
}

/** Up to 8 questions, rotating question types. Each has the right answer plus 3 wrong ones from the same pool. */
export function buildQuiz(pool: Entry[], length = QUIZ_LENGTH): Question[] {
  const withPicture = new Set(pictureEntries(pool))
  const canUsePictures = withPicture.size >= 4
  const types: QuestionType[] = canUsePictures ? ['listen-pic', 'native', 'pic-text', 'listen-text'] : ['native', 'listen-text']

  return shuffle(pool)
    .slice(0, Math.min(length, pool.length))
    .map((entry, i) => {
      let type = types[i % types.length]
      const isPictureQuestion = type === 'listen-pic' || type === 'pic-text'
      if (isPictureQuestion && !withPicture.has(entry)) type = type === 'listen-pic' ? 'listen-text' : 'native'
      const candidates = type === 'listen-pic' ? [...withPicture] : pool
      const wrong = shuffle(candidates.filter((x) => x !== entry && x.item.en !== entry.item.en)).slice(0, 3)
      return { entry, type, options: shuffle([entry, ...wrong]) }
    })
}

export const isListening = (type: QuestionType) => type === 'listen-pic' || type === 'listen-text'

/** 90 % or more = 3 stars, 70 % = 2, 40 % = 1 */
export const starsForScore = (score: number, total: number) => {
  const pct = total ? score / total : 0
  return pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0
}
