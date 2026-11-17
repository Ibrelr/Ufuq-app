import type { Lang } from '../content'
import type { Entry } from './entries'

export const ALPHABET: Record<Lang, string> = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  ar: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوية',
}
const stripMarks = (s: string) => s.replace(/[\u064B-\u065F\u0670]/g, '')

/** The word as letters, if it is a single word short enough to spell. */
export function spellLetters(word: string, lang: Lang): string[] | null {
  const w = lang === 'en' ? word.toLowerCase() : stripMarks(word)
  const ok = lang === 'en' ? /^[a-z]{2,10}$/.test(w) : /^[ء-ي]{2,8}$/.test(w)
  return ok ? [...w] : null
}

export const spellableEntries = (pool: Entry[], lang: Lang) =>
  pool.filter((e) => e.topic.type === 'words' && spellLetters(e.item[lang], lang))
