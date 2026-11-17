import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getReading, type Reading } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useSequence } from '../lib/useSequence'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { PlayIcon, SpeakerIcon, StopIcon } from '../components/Icons'
import { TopicIcon, UiIcon } from '../components/Pic'
import { SentencePractice } from '../components/SentencePractice'
import { btn, card } from '../components/ui'
import { modeTab } from './ConversationPage'
import { NotFound } from './NotFound'

export function ReadingPage() {
  const { id = '', mode = 'read' } = useParams()
  const { t, name } = useLanguage()
  const { markDone } = useStats()
  const reading = getReading(id)
  const sentences = useMemo(() => reading?.sentences.map((s, i) => ({ ...s, key: `read:${reading.id}/${i}` })) ?? [], [reading])
  if (!reading) return <NotFound />

  return (
    <>
      <Breadcrumbs items={[{ label: t.reading, to: '/read' }, { label: name(reading.title) }]} />
      <div className="flex flex-wrap items-center gap-4 pt-3 pb-4">
        <TopicIcon icon={reading.icon} iconImg={reading.iconImg} className="size-14" />
        <h1 className="font-display m-0 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">{name(reading.title)}</h1>
      </div>
      <nav className="mb-5 flex flex-wrap gap-2.5" aria-label={name(reading.title)}>
        <NavLink end to={`/read/${reading.id}`} className={modeTab}>
          <UiIcon emoji="📖" className="size-7" />
          <b className="text-[17px]">{t.read}</b>
        </NavLink>
        <NavLink to={`/read/${reading.id}/practise`} className={modeTab}>
          <UiIcon emoji="🧩" className="size-7" />
          <b className="text-[17px]">{t.practise}</b>
        </NavLink>
      </nav>
      {mode === 'practise' ? (
        <SentencePractice key={reading.id} sentences={sentences} types={['meaning', 'gap', 'build']} onFinish={() => markDone(`read:${reading.id}`)} />
      ) : (
        <ReadView key={reading.id} reading={reading} />
      )}
    </>
  )
}

function ReadView({ reading }: { reading: Reading }) {
  const { t, target, native } = useLanguage()
  const { speakText } = useSpeak()
  const [selected, setSelected] = useState<number | null>(null)
  const [parallel, setParallel] = useState(false)
  const steps = useMemo(() => reading.sentences.map((s) => ({ text: s[target], lang: target })), [reading, target])
  const seq = useSequence(steps, setSelected)
  const active = seq.current ?? selected

  const tap = (i: number) => {
    seq.stop()
    setSelected(i)
    speakText(reading.sentences[i][target], target)
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" className={btn.sun} onClick={() => seq.toggle()}>
          {seq.playing ? <StopIcon /> : <PlayIcon />} {seq.playing ? t.stop : t.readAloud}
        </button>
        <label className="ms-auto inline-flex cursor-pointer items-center gap-2 font-bold">
          <input type="checkbox" checked={parallel} onChange={(e) => setParallel(e.target.checked)} className="size-5 accent-primary" />
          {t.showTranslation}
        </label>
      </div>
      <p className="mt-0 mb-4 text-muted">{t.tapSentence}</p>

      <article className={`${card} p-5 sm:p-7`}>
        {parallel ? (
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            {reading.sentences.map((s, i) => (
              <li key={i}>
                <button type="button" onClick={() => tap(i)} className={`w-full cursor-pointer rounded-2xl border-2 p-3 text-start ${active === i ? 'border-sun bg-sun-tint' : 'border-transparent bg-transparent hover:bg-bg'}`}>
                  <span lang={target} dir="auto" className="block text-xl leading-relaxed font-bold">
                    {s[target]}
                  </span>
                  <span lang={native} dir="auto" className="mt-1 block text-lg text-muted">
                    {s[native]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p lang={target} dir={target === 'ar' ? 'rtl' : 'ltr'} className="m-0 text-xl leading-[2] sm:text-2xl sm:leading-[2]">
            {reading.sentences.map((s, i) => (
              <span key={i}>
                <button
                  type="button"
                  onClick={() => tap(i)}
                  className={`inline cursor-pointer rounded-lg border-0 px-0.5 text-start font-[inherit] leading-[inherit] ${active === i ? 'bg-sun-tint text-ink underline decoration-sun decoration-4 underline-offset-4' : 'bg-transparent hover:bg-tint'}`}
                >
                  {s[target]}
                </button>{' '}
              </span>
            ))}
          </p>
        )}
      </article>

      {!parallel && active !== null && (
        <div role="status" className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-sun bg-sun-tint p-4">
          <button type="button" onClick={() => tap(active)} aria-label={t.hear} className="flex-none cursor-pointer rounded-full border-0 bg-primary p-2.5 text-white">
            <SpeakerIcon size={20} />
          </button>
          <span lang={native} dir="auto" className="text-lg">
            {reading.sentences[active][native]}
          </span>
        </div>
      )}

      <section className={`${card} mt-5 p-5`}>
        <h2 className="font-display mt-0 mb-3 text-2xl">{t.vocabulary}</h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
          {reading.vocab.map((v, i) => (
            <li key={i}>
              <button type="button" onClick={() => speakText(v[target], target)} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-line bg-surface px-3 py-2.5 text-start hover:border-primary">
                <SpeakerIcon size={20} className="flex-none text-primary-dark" />
                <b lang={target} dir="auto" className="text-lg">
                  {v[target]}
                </b>
                <span lang={native} dir="auto" className="ms-auto text-muted">
                  {v[native]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
