import type { Lang, Sentence, Speaker } from '../content'
import { normalize } from './normalize'
import { shuffle } from './quiz'

export type SentenceQuestionType = 'build' | 'gap' | 'meaning' | 'who'

export interface PracticeSentence extends Sentence {
  key: string
  speaker?: Speaker
}

export interface SentenceQuestion {
  type: SentenceQuestionType
  sentence: PracticeSentence
  /** build: shuffled words; gap/meaning/who: answer options */
  options: string[]
  answer: string
  /** gap: the sentence with the missing word shown as ____ */
  prompt?: string
}

export const words = (s: string) => s.split(/\s+/).filter(Boolean)
const bare = (w: string) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')

/** The word worth practising in a sentence: the longest one */
function gapWord(s: string) {
  const ws = words(s).map(bare).filter((w) => w.length > 2)
  return ws.sort((a, b) => b.length - a.length)[0]
}

/**
 * Mixed exercises for sentences: put words in order, fill the gap,
 * choose the meaning, and (in conversations) who said it.
 */
export function buildSentenceQuiz(
  pool: PracticeSentence[],
  target: Lang,
  native: Lang,
  types: SentenceQuestionType[],
  length = 8,
): SentenceQuestion[] {
  const allWords = [...new Set(pool.flatMap((s) => words(s[target]).map(bare)).filter((w) => w.length > 2))]
  return shuffle(pool)
    .slice(0, Math.min(length, pool.length))
    .map((sentence, i) => {
      let type = types[i % types.length]
      const text = sentence[target]
      if (type === 'build' && words(text).length > 11) type = 'meaning'
      if (type === 'who' && !sentence.speaker) type = 'meaning'
      if (type === 'gap' && !gapWord(text)) type = 'meaning'

      if (type === 'build') {
        let opts = shuffle(words(text))
        for (let tries = 0; tries < 5 && opts.join(' ') === text && opts.length > 1; tries++) opts = shuffle(words(text))
        return { type, sentence, options: opts, answer: text }
      }
      if (type === 'gap') {
        const w = gapWord(text)!
        const others = shuffle(allWords.filter((x) => normalize(x) !== normalize(w))).slice(0, 3)
        const idx = words(text).findIndex((x) => bare(x) === w)
        const prompt = words(text)
          .map((x, j) => (j === idx ? x.replace(w, '_____') : x))
          .join(' ')
        return { type, sentence, options: shuffle([w, ...others]), answer: w, prompt }
      }
      if (type === 'who') {
        return { type, sentence, options: [], answer: sentence.speaker!.id }
      }
      const others = shuffle(pool.filter((x) => x !== sentence && x[native] !== sentence[native]))
        .slice(0, 3)
        .map((x) => x[native])
      return { type: 'meaning' as const, sentence, options: shuffle([sentence[native], ...others]), answer: sentence[native] }
    })
}
