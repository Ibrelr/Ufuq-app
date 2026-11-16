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

/** Up to 8 questions, rotating question types. Each has the right answer plus 3 wrong ones from the same topic. */
export function buildQuiz(topic: Topic): Question[] {
  const types: QuestionType[] =
    topic.type === 'words' ? ['listen-pic', 'native', 'pic-text', 'listen-text'] : ['native', 'listen-text']
  return shuffle(topic.items)
    .slice(0, Math.min(QUIZ_LENGTH, topic.items.length))
    .map((item, i) => ({
      item,
      type: types[i % types.length],
      options: shuffle([item, ...shuffle(topic.items.filter((x) => x !== item)).slice(0, 3)]),
    }))
}

export const isListening = (type: QuestionType) => type === 'listen-pic' || type === 'listen-text'

/** 90 % or more = 3 stars, 70 % = 2, 40 % = 1 */
export const starsForScore = (score: number, total: number) => {
  const pct = total ? score / total : 0
  return pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0
}
