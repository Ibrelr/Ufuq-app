import type { Item } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import type { ReactNode } from 'react'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { HeartIcon, SlowIcon, SpeakerIcon } from './Icons'
import { Pic } from './Pic'

interface Props {
  item: Item
  topicId: string
  wide?: boolean
  highlighted?: boolean
  onBeforeSpeak?: () => void
  /** Shown above the word, e.g. the topic in search results */
  label?: ReactNode
}

const actionBtn =
  'inline-flex min-h-11.5 flex-1 cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent text-sm font-extrabold text-primary-dark hover:bg-tint [&+&]:border-s [&+&]:border-line'

/** A picture card: tap it to hear the word in the language being learned. */
export function WordCard({ item, topicId, wide, highlighted, onBeforeSpeak, label }: Props) {
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem } = useSpeak()
  const { isSaved, toggleSaved } = useStats()
  const key = `${topicId}/${item.id}`
  const saved = isSaved(key)

  // In the two-column phone grid there is only room for icons
  const labelCls = wide ? '' : 'hidden sm:inline'

  const play = (opts?: { slow?: boolean; native?: boolean }) => {
    onBeforeSpeak?.()
    speakItem(item, topicId, { slow: opts?.slow, lang: opts?.native ? native : target })
  }

  return (
    <div
      id={`card-${item.id}`}
      className={`relative flex flex-col overflow-hidden rounded-[22px] border-2 bg-surface shadow-[0_4px_0_var(--color-line)] transition ${
        highlighted ? '-translate-y-1 border-sun' : 'border-line'
      }`}
    >
      {label && <div className="truncate ps-3 pe-11 pt-2.5 text-start text-xs font-extrabold text-muted">{label}</div>}
      <button
        type="button"
        onClick={() => toggleSaved(key)}
        aria-pressed={saved}
        aria-label={saved ? t.unsaveWord : t.saveWord}
        className={`absolute end-1.5 top-1.5 z-[1] flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent hover:bg-tint ${saved ? 'text-bad' : 'text-line hover:text-muted'}`}
      >
        <HeartIcon filled={saved} />
      </button>
      <button
        type="button"
        onClick={() => play()}
        aria-label={`${t.hear}: ${tgt(item)}`}
        className={`flex cursor-pointer border-0 bg-transparent ${
          wide ? 'flex-row items-center gap-3.5 p-4 pe-12 text-start' : 'flex-col items-center gap-1 px-3 pt-4.5 pb-2.5 text-center'
        }`}
      >
        <span className={`flex flex-none items-center justify-center ${wide ? '' : 'min-h-19'}`}>
          <Pic item={item} size={wide ? 'sm' : 'md'} />
        </span>
        <span className="flex flex-col gap-0.5">
          <span lang={target} dir="auto" className={`font-extrabold leading-tight ${wide ? 'text-xl' : 'text-[21px] sm:text-[26px]'}`}>
            {tgt(item)}
          </span>
          <span lang={native} dir="auto" className="text-[17px] text-muted">
            {nat(item)}
          </span>
        </span>
      </button>
      <div className="mt-auto flex border-t border-line">
        <button type="button" className={actionBtn} onClick={() => play()} aria-label={t.hear}>
          <SpeakerIcon />
          <span className={labelCls}>{t.hear}</span>
        </button>
        <button type="button" className={actionBtn} onClick={() => play({ slow: true })} aria-label={t.slow}>
          <SlowIcon />
          <span className={labelCls}>{t.slow}</span>
        </button>
        <button type="button" className={actionBtn} onClick={() => play({ native: true })} aria-label={t.hearNative}>
          <SpeakerIcon />
          {/* A short language tag fits on every screen: ع for Arabic, EN for English */}
          <span lang={native}>{native === 'ar' ? 'ع' : 'EN'}</span>
        </button>
      </div>
    </div>
  )
}
