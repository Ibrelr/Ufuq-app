import type { Item, Topic } from '../content'

export type QuestionType = 'listen-pic' | 'native' | 'pic-text' | 'listen-text'

export interface Question {
  item: Item
  type: QuestionType
  options: Item[]
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
 * A picture can stand for a word in a quiz only if no other word in the topic shares it,
 * and it doesn't spell out the answer. Days of the week, for example, all use 📅.
 */
function pictureItems(topic: Topic) {
  const count = new Map<string, number>()
  for (const it of topic.items) count.set(it.pic, (count.get(it.pic) ?? 0) + 1)
  return new Set(topic.items.filter((it) => count.get(it.pic) === 1 && !it.pic.startsWith('=')))
}

/** Up to 8 questions, rotating question types. Each has the right answer plus 3 wrong ones from the same topic. */
export function buildQuiz(topic: Topic): Question[] {
  const withPicture = pictureItems(topic)
  const canUsePictures = topic.type === 'words' && withPicture.size >= 4
  const types: QuestionType[] = canUsePictures ? ['listen-pic', 'native', 'pic-text', 'listen-text'] : ['native', 'listen-text']

  return shuffle(topic.items)
    .slice(0, Math.min(QUIZ_LENGTH, topic.items.length))
    .map((item, i) => {
      let type = types[i % types.length]
      const isPictureQuestion = type === 'listen-pic' || type === 'pic-text'
      // This word's picture isn't unique, so ask in words instead
      if (isPictureQuestion && !withPicture.has(item)) type = type === 'listen-pic' ? 'listen-text' : 'native'
      // Picture answers must all be different pictures
      const pool = type === 'listen-pic' ? [...withPicture] : topic.items
      const wrong = shuffle(pool.filter((x) => x !== item)).slice(0, 3)
      return { item, type, options: shuffle([item, ...wrong]) }
    })
}

export const isListening = (type: QuestionType) => type === 'listen-pic' || type === 'listen-text'

/** 90 % or more = 3 stars, 70 % = 2, 40 % = 1 */
export const starsForScore = (score: number, total: number) => {
  const pct = total ? score / total : 0
  return pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0
}
