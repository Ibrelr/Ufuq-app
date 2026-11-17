import {
  conversationsForLevel,
  grammarForLevel,
  LEVELS,
  readingsForLevel,
  topicsForLevel,
  type Lang,
  type LevelId,
  type Localized,
} from '../content'

export type StepKind = 'words' | 'phrases' | 'grammar' | 'talk' | 'read'

export interface Step {
  key: string
  kind: StepKind
  level: LevelId
  title: Localized
  icon: string
  iconImg?: string
  to: string
}

/**
 * The course: every level's content in a sensible order.
 * Words come first, then a rhythm of grammar, sentences, conversation and reading.
 * English grammar is only part of the path for people learning English.
 */
export function buildPath(level: LevelId, target: Lang): Step[] {
  const words = topicsForLevel(level).filter((t) => t.type === 'words')
  const phrases = topicsForLevel(level).filter((t) => t.type === 'phrases')
  const grammar = target === 'en' ? grammarForLevel(level) : []
  const talks = conversationsForLevel(level)
  const reads = readingsForLevel(level)

  const queues: Step[][] = [
    words.map((t) => ({ key: `topic:${t.id}`, kind: 'words' as const, level, title: t.name, icon: t.icon, iconImg: t.iconImg, to: `/topic/${t.id}` })),
    grammar.map((g) => ({ key: `grammar:${g.id}`, kind: 'grammar' as const, level, title: g.title, icon: g.icon, iconImg: g.iconImg, to: `/grammar/${g.id}` })),
    phrases.map((t) => ({ key: `topic:${t.id}`, kind: 'phrases' as const, level, title: t.name, icon: t.icon, iconImg: t.iconImg, to: `/topic/${t.id}` })),
    talks.map((c) => ({ key: `talk:${c.id}`, kind: 'talk' as const, level, title: c.title, icon: c.icon, iconImg: c.iconImg, to: `/talk/${c.id}` })),
    reads.map((r) => ({ key: `read:${r.id}`, kind: 'read' as const, level, title: r.title, icon: r.icon, iconImg: r.iconImg, to: `/read/${r.id}` })),
  ]
  // How many of each to take per round: two word topics, then one of everything else
  const take = [2, 1, 1, 1, 1]
  const out: Step[] = []
  while (queues.some((q) => q.length)) {
    queues.forEach((q, i) => out.push(...q.splice(0, take[i])))
  }
  return out
}

export const fullPath = (target: Lang) => LEVELS.flatMap((l) => buildPath(l.id, target))
