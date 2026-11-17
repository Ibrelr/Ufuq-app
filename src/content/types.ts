export type Lang = 'ar' | 'en'
export type LevelId = 'a1' | 'a2' | 'b1' | 'b2' | 'c1'
export type Localized = Record<Lang, string>

export interface Level {
  id: LevelId
  code: string
  name: Localized
  description: Localized
}

export interface Item {
  /** Stable id, also used for audio files: /audio/{lang}/{topicId}/{id}.mp3 */
  id: string
  /**
   * An emoji, a hex colour such as "#E5484D" (colours topic),
   * or "=" followed by text to show as the picture, such as "=12" (numbers).
   */
  pic: string
  /** Fluent Emoji picture name, set by the content script: /pics/{img}.svg */
  img?: string
  en: string
  ar: string
}

export interface Topic {
  id: string
  level: LevelId
  /** "words" get picture quizzes and a card grid; "phrases" get a list layout */
  type: 'words' | 'phrases'
  icon: string
  iconImg?: string
  name: Localized
  items: Item[]
}
