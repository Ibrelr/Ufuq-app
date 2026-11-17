import { useCallback, useEffect, useRef, useState } from 'react'
import { useSpeak } from './useSpeak'
import type { Lang } from '../content'

export interface SequenceStep {
  text: string
  lang: Lang
  gender?: 'm' | 'f'
}

/**
 * Plays a list of lines one after another (a whole conversation or text),
 * and says which one is playing. Some browsers never report "end", so it moves on after a while anyway.
 */
export function useSequence(steps: SequenceStep[], onStep?: (i: number) => void) {
  const { speakText, stop } = useSpeak()
  const [current, setCurrent] = useState<number | null>(null)
  const run = useRef(0)
  const onStepRef = useRef(onStep)
  useEffect(() => {
    onStepRef.current = onStep
  })

  const stopAll = useCallback(() => {
    run.current++
    setCurrent(null)
    stop()
  }, [stop])

  useEffect(() => stopAll, [stopAll])

  const playFrom = useCallback(
    (start: number, id: number) => {
      const step = (i: number) => {
        if (id !== run.current) return
        if (i >= steps.length) {
          setCurrent(null)
          return
        }
        setCurrent(i)
        onStepRef.current?.(i)
        const s = steps[i]
        let done = false
        const next = () => {
          if (done) return
          done = true
          window.setTimeout(() => step(i + 1), 600)
        }
        speakText(s.text, s.lang, { gender: s.gender, onEnd: next })
        window.setTimeout(next, 4000 + s.text.length * 90)
      }
      step(start)
    },
    [steps, speakText],
  )

  const toggle = useCallback(
    (from = 0) => {
      if (current !== null) return stopAll()
      playFrom(from, ++run.current)
    },
    [current, playFrom, stopAll],
  )

  return { current, playing: current !== null, toggle, stop: stopAll }
}
