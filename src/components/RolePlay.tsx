import { useEffect, useRef, useState } from 'react'
import type { Conversation, Speaker } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { similarity } from '../lib/normalize'
import { getRecognition, speechRecognitionSupported, type Recognition } from '../lib/recognition'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { Bubble } from './ChatView'
import { SpeakerIcon } from './Icons'
import { TopicIcon } from './Pic'
import { btn, card } from './ui'

/** The learner plays one person in the conversation; the app plays the other. */
export function RolePlay({ convo, onDone }: { convo: Conversation; onDone: () => void }) {
  const { t, name } = useLanguage()
  const [me, setMe] = useState<Speaker | null>(null)
  const [round, setRound] = useState(0)

  if (!me) {
    return (
      <div className={`${card} mx-auto flex max-w-3xl flex-col gap-4 p-6`}>
        <h2 className="font-display m-0 text-2xl">{t.chooseRole}</h2>
        <p className="m-0 text-muted">{t.roleplayHint}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {convo.speakers.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => setMe(sp)}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-line bg-surface p-4 text-start shadow-[0_4px_0_var(--color-line)] hover:border-primary"
            >
              <TopicIcon icon={sp.icon} iconImg={sp.iconImg} className="size-14" />
              <span className="flex flex-col">
                <b className="text-xl">{name(sp.name)}</b>
                <span className="text-muted">{name(sp.role)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <RolePlayRun
      key={`${me.id}-${round}`}
      convo={convo}
      me={me}
      onDone={onDone}
      onAgain={() => setRound((r) => r + 1)}
      onSwitch={() => setMe(convo.speakers.find((s) => s.id !== me.id)!)}
    />
  )
}

function RolePlayRun({ convo, me, onDone, onAgain, onSwitch }: { convo: Conversation; me: Speaker; onDone: () => void; onAgain: () => void; onSwitch: () => void }) {
  const { t, target, native, name } = useLanguage()
  const { speakText, stop } = useSpeak()
  const { answer } = useStats()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState<{ text: string; ok: boolean } | null>(null)
  const rec = useRef<Recognition | null>(null)
  const canListen = speechRecognitionSupported()
  const finished = index >= convo.lines.length
  const line = convo.lines[index]
  const mine = line?.speaker === me.id
  const other = convo.speakers.find((s) => s.id !== me.id)!

  useEffect(() => () => rec.current?.abort(), [])

  // The other person speaks, then it moves on by itself
  useEffect(() => {
    if (finished || mine) return
    let moved = false
    const next = () => {
      if (moved) return
      moved = true
      window.setTimeout(() => setIndex((i) => i + 1), 500)
    }
    speakText(line[target], target, { gender: other.gender, onEnd: next })
    const timer = window.setTimeout(next, 4000 + line[target].length * 90)
    document.getElementById(`line-${index}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    return () => window.clearTimeout(timer)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (finished) onDone()
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  if (finished) return <ActivityResult message={t.roleplayDone} onAgain={onAgain} extra={<button type="button" className={btn.ghost} onClick={onSwitch}>{`${t.chooseRole}: ${name(other.name)}`}</button>} />

  const listen = () => {
    const Ctor = getRecognition()
    if (!Ctor) return
    stop()
    const r = new Ctor()
    r.lang = target === 'en' ? 'en-US' : 'ar-SA'
    r.interimResults = false
    r.maxAlternatives = 5
    r.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript)
      const best = alts.reduce((b, a) => (similarity(a, line[target]) > similarity(b, line[target]) ? a : b), alts[0] ?? '')
      setHeard({ text: best, ok: similarity(best, line[target]) >= 0.6 })
      setRevealed(true)
    }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    rec.current = r
    setListening(true)
    try {
      r.start()
    } catch {
      setListening(false)
    }
  }

  const next = () => {
    answer(`talk:${convo.id}/${index}`, true, { track: false })
    setRevealed(false)
    setHeard(null)
    setIndex((i) => i + 1)
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="flex flex-col gap-4">
        {convo.lines.slice(0, index).map((_, i) => (
          <Bubble key={i} convo={convo} index={i} showTranslation={false} />
        ))}
        {!mine && <Bubble convo={convo} index={index} showTranslation={false} active />}
      </div>

      {mine && (
        <div className={`${card} mt-5 flex flex-col gap-4 border-2 border-sun p-5`}>
          <div className="flex items-center gap-3">
            <TopicIcon icon={me.icon} iconImg={me.iconImg} className="size-10" />
            <b className="text-lg">{t.yourTurn}</b>
          </div>
          <p lang={native} dir="auto" className="m-0 rounded-2xl bg-bg p-4 text-xl font-bold">
            {line[native]}
          </p>
          {revealed && (
            <p lang={target} dir="auto" className="m-0 rounded-2xl bg-tint p-4 text-xl font-extrabold text-primary-dark">
              {line[target]}
            </p>
          )}
          {heard && (
            <p className={`m-0 rounded-2xl p-3 ${heard.ok ? 'bg-ok-tint text-ok-ink' : 'bg-sun-tint text-sun-ink'}`}>
              {t.heard} <b dir="auto">«{heard.text}»</b> — {heard.ok ? t.speakGood : t.speakTry}
            </p>
          )}
          <div className="flex flex-wrap gap-2.5">
            {canListen && (
              <button type="button" className={btn.bad} onClick={listen} disabled={listening}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0" />
                  <path d="M12 18v3" />
                </svg>
                {listening ? t.listening : t.sayIt}
              </button>
            )}
            {!revealed && (
              <button type="button" className={btn.ghost} onClick={() => setRevealed(true)}>
                {t.showLine}
              </button>
            )}
            <button
              type="button"
              className={btn.ghost}
              onClick={() => {
                setRevealed(true)
                speakText(line[target], target, { gender: me.gender })
              }}
            >
              <SpeakerIcon /> {t.hear}
            </button>
            <button type="button" className={btn.ok} onClick={next}>
              {t.continue}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
