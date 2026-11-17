import { useEffect, useMemo, useState } from 'react'
import type { Conversation } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useSequence } from '../lib/useSequence'
import { useSpeak } from '../lib/useSpeak'
import { PlayIcon, SlowIcon, StopIcon } from './Icons'
import { TopicIcon } from './Pic'
import { btn } from './ui'

/** One line of a conversation as a chat bubble. The first speaker is on the start side, the second on the end side. */
export function Bubble({
  convo,
  index,
  showTranslation,
  active,
  onPlay,
  onSlow,
  hidden,
}: {
  convo: Conversation
  index: number
  showTranslation: boolean
  active?: boolean
  onPlay?: () => void
  onSlow?: () => void
  hidden?: boolean
}) {
  const { target, native, name, t } = useLanguage()
  const line = convo.lines[index]
  const sp = convo.speakers.find((s) => s.id === line.speaker)!
  const second = convo.speakers[1].id === sp.id
  return (
    <div id={`line-${index}`} className={`flex items-end gap-2.5 ${second ? 'flex-row-reverse' : ''}`}>
      <TopicIcon icon={sp.icon} iconImg={sp.iconImg} className="size-10 flex-none sm:size-12" />
      <div className={`flex max-w-[85%] flex-col gap-1 ${second ? 'items-end' : 'items-start'}`}>
        <span className="px-2 text-sm font-extrabold text-muted">{name(sp.name)}</span>
        <div
          className={`rounded-3xl border-2 px-4 py-3 transition ${second ? 'rounded-ee-md bg-tint' : 'rounded-es-md bg-surface'} ${
            active ? 'border-sun shadow-[0_0_0_4px_var(--color-sun-tint)]' : 'border-line'
          }`}
        >
          {hidden ? (
            <span className="text-lg font-bold text-muted">…</span>
          ) : (
            <button type="button" onClick={onPlay} className="block cursor-pointer border-0 bg-transparent p-0 text-start" aria-label={`${t.hear}: ${line[target]}`}>
              <span lang={target} dir="auto" className="block text-lg leading-snug font-extrabold sm:text-xl">
                {line[target]}
              </span>
              {showTranslation && (
                <span lang={native} dir="auto" className="mt-1 block text-base text-muted">
                  {line[native]}
                </span>
              )}
            </button>
          )}
        </div>
        {onSlow && !hidden && (
          <button type="button" onClick={onSlow} className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent px-2 text-sm font-extrabold text-primary-dark">
            <SlowIcon size={16} /> {t.slow}
          </button>
        )}
      </div>
    </div>
  )
}

/** The whole conversation: play it, read along, tap any line. */
export function ChatView({ convo, onHeardAll }: { convo: Conversation; onHeardAll?: () => void }) {
  const { t, target } = useLanguage()
  const { speakText } = useSpeak()
  const [showTranslation, setShowTranslation] = useState(true)
  const genderOf = (speaker: string) => convo.speakers.find((s) => s.id === speaker)?.gender
  const steps = useMemo(() => convo.lines.map((l) => ({ text: l[target], lang: target, gender: genderOf(l.speaker) })), [convo, target]) // eslint-disable-line react-hooks/exhaustive-deps
  const [maxHeard, setMaxHeard] = useState(-1)
  const seq = useSequence(steps, (i) => {
    setMaxHeard((m) => Math.max(m, i))
    document.getElementById(`line-${i}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })

  useEffect(() => {
    if (maxHeard === convo.lines.length - 1) onHeardAll?.()
  }, [maxHeard]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" className={btn.sun} onClick={() => seq.toggle()}>
          {seq.playing ? <StopIcon /> : <PlayIcon />} {seq.playing ? t.stop : t.playConversation}
        </button>
        <label className="ms-auto inline-flex cursor-pointer items-center gap-2 font-bold">
          <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} className="size-5 accent-primary" />
          {t.showTranslation}
        </label>
      </div>
      <p className="mt-0 mb-4 text-muted">{t.listenHint}</p>
      <div className="flex flex-col gap-4">
        {convo.lines.map((l, i) => (
          <Bubble
            key={i}
            convo={convo}
            index={i}
            showTranslation={showTranslation}
            active={seq.current === i}
            onPlay={() => {
              seq.stop()
              speakText(l[target], target, { gender: genderOf(l.speaker) })
              setMaxHeard((m) => Math.max(m, i))
            }}
            onSlow={() => {
              seq.stop()
              speakText(l[target], target, { gender: genderOf(l.speaker), slow: true })
            }}
          />
        ))}
      </div>
    </div>
  )
}
