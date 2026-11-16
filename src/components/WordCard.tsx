import type { Item } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useSpeak } from '../lib/useSpeak'
import { SlowIcon, SpeakerIcon } from './Icons'
import { Pic } from './Pic'

interface Props {
  item: Item
  topicId: string
  wide?: boolean
  highlighted?: boolean
  onBeforeSpeak?: () => void
}

const actionBtn =
  'inline-flex min-h-11.5 flex-1 cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent text-sm font-extrabold text-primary-dark hover:bg-tint [&+&]:border-s [&+&]:border-line'

/** A picture card: tap it to hear the word in the language being learned. */
export function WordCard({ item, topicId, wide, highlighted, onBeforeSpeak }: Props) {
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem } = useSpeak()

  const play = (opts?: { slow?: boolean; native?: boolean }) => {
    onBeforeSpeak?.()
    speakItem(item, topicId, { slow: opts?.slow, lang: opts?.native ? native : target })
  }

  return (
    <div
      id={`card-${item.id}`}
      className={`flex flex-col overflow-hidden rounded-[22px] border-2 bg-surface shadow-[0_4px_0_var(--color-line)] transition ${
        highlighted ? '-translate-y-1 border-sun' : 'border-line'
      }`}
    >
      <button
        type="button"
        onClick={() => play()}
        aria-label={`${t.hear}: ${tgt(item)}`}
        className={`flex cursor-pointer border-0 bg-transparent ${
          wide ? 'flex-row items-center gap-3.5 p-4 text-start' : 'flex-col items-center gap-1 px-3 pt-4.5 pb-2.5 text-center'
        }`}
      >
        <span className={`flex flex-none items-center justify-center ${wide ? '' : 'min-h-19'}`}>
          <Pic pic={item.pic} size={wide ? 'sm' : 'md'} />
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
        <button type="button" className={actionBtn} onClick={() => play()}>
          <SpeakerIcon />
          <span>{t.hear}</span>
        </button>
        <button type="button" className={actionBtn} onClick={() => play({ slow: true })}>
          <SlowIcon />
          <span>{t.slow}</span>
        </button>
        <button type="button" className={actionBtn} onClick={() => play({ native: true })}>
          <SpeakerIcon />
          <span>{t.hearNative}</span>
        </button>
      </div>
    </div>
  )
}
