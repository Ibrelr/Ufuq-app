import { useCallback, useEffect, useRef, useState } from 'react'
import type { Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useSpeak } from '../lib/useSpeak'
import { PlayIcon, StopIcon } from './Icons'
import { WordCard } from './WordCard'
import { btn } from './ui'

/** All cards in a topic, plus "listen to all", which reads them one after another. */
export function LearnView({ topic }: { topic: Topic }) {
  const { t, tgt } = useLanguage()
  const { speakItem, stop } = useSpeak()
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const run = useRef(0) // bumps on every start/stop so old callbacks do nothing

  const stopAll = useCallback(() => {
    run.current++
    setPlayingIndex(null)
    stop()
  }, [stop])

  useEffect(() => stopAll, [topic.id, stopAll])

  const playFrom = (i: number, id: number) => {
    if (id !== run.current) return
    if (i >= topic.items.length) {
      setPlayingIndex(null)
      return
    }
    const item = topic.items[i]
    setPlayingIndex(i)
    document.getElementById(`card-${item.id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    let done = false
    const next = () => {
      if (done) return
      done = true
      window.setTimeout(() => playFrom(i + 1, id), 700)
    }
    speakItem(item, topic.id, { onEnd: next })
    // Some browsers never fire "end", so move on anyway
    window.setTimeout(next, 6000 + tgt(item).length * 80)
  }

  const toggle = () => {
    if (playingIndex !== null) return stopAll()
    const id = ++run.current
    playFrom(0, id)
  }

  const wide = topic.type === 'phrases'

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pb-3.5">
        <p className="m-0 flex-1 text-muted">{t.tapHint}</p>
        <button type="button" className={`${btn.sun} min-h-12 text-base`} onClick={toggle}>
          {playingIndex !== null ? <StopIcon /> : <PlayIcon />}
          <span>{playingIndex !== null ? t.stop : t.playAll}</span>
        </button>
      </div>
      <div
        className={`grid gap-3.5 pb-12 ${
          wide ? 'grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]' : 'grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]'
        }`}
      >
        {topic.items.map((item, i) => (
          <WordCard
            key={item.id}
            item={item}
            topicId={topic.id}
            wide={wide}
            highlighted={playingIndex === i}
            onBeforeSpeak={playingIndex !== null ? stopAll : undefined}
          />
        ))}
      </div>
    </>
  )
}
