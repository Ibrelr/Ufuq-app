import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Item, Lang, Localized } from '../content'
import { readStorage, writeStorage } from '../lib/storage'
import { STRINGS, type Strings } from './strings'

/**
 * ar2en: an Arabic speaker learning English (UI in Arabic, right to left).
 * en2ar: an English speaker learning Arabic (UI in English, left to right).
 */
export type Direction = 'ar2en' | 'en2ar'

interface LanguageValue {
  direction: Direction
  setDirection: (d: Direction) => void
  /** Language of the interface (= the learner's own language) */
  ui: Lang
  /** Language being learned */
  target: Lang
  native: Lang
  t: Strings
  /** The word in the language being learned */
  tgt: (item: Item) => string
  /** The word in the learner's own language */
  nat: (item: Item) => string
  /** A localized label in the UI language, and in the other one */
  name: (l: Localized) => string
  altName: (l: Localized) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)
const KEY = 'ufuq-dir'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [direction, setDir] = useState<Direction>(() => readStorage<Direction>(KEY, 'ar2en'))

  const setDirection = useCallback((d: Direction) => {
    setDir(d)
    writeStorage(KEY, d)
  }, [])

  const value = useMemo<LanguageValue>(() => {
    const ui: Lang = direction === 'ar2en' ? 'ar' : 'en'
    const target: Lang = direction === 'ar2en' ? 'en' : 'ar'
    const other: Lang = ui === 'ar' ? 'en' : 'ar'
    return {
      direction,
      setDirection,
      ui,
      target,
      native: ui,
      t: STRINGS[ui],
      tgt: (item) => item[target],
      nat: (item) => item[ui],
      name: (l) => l[ui],
      altName: (l) => l[other],
    }
  }, [direction, setDirection])

  useEffect(() => {
    const root = document.documentElement
    root.lang = value.ui
    root.dir = value.ui === 'ar' ? 'rtl' : 'ltr'
    document.title = value.ui === 'ar' ? 'أُفق – تعلّم الإنجليزية خطوة بخطوة' : 'Ufuq – Learn Arabic step by step'
  }, [value.ui])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- provider and hook live together on purpose
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
