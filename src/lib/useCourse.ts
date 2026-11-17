import { useMemo } from 'react'
import type { LevelId } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { buildPath, fullPath, type Step } from './path'
import { useProgress } from './progress'
import { useStats } from './stats'

/** The learning path plus which steps are done and what comes next. */
export function useCourse(level?: LevelId) {
  const { target } = useLanguage()
  const { stars } = useProgress()
  const { isDone } = useStats()
  const steps = useMemo(() => (level ? buildPath(level, target) : fullPath(target)), [level, target])
  const isStepDone = (s: Step) => (s.key.startsWith('topic:') ? stars(s.key.slice(6)) > 0 : isDone(s.key))
  const next = steps.find((s) => !isStepDone(s))
  const done = steps.filter(isStepDone).length
  return { steps, isStepDone, next, done, total: steps.length }
}
