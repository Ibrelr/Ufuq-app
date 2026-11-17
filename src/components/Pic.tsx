import type { Item } from '../content'

type Size = 'sm' | 'md' | 'lg'

const BOX: Record<Size, string> = {
  sm: 'size-11',
  md: 'size-16 sm:size-[72px]',
  lg: 'size-22',
}

const toArabicDigits = (s: string) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)])

/**
 * An item's picture:
 * - a Fluent Emoji SVG when the content script found one (`img`)
 * - a colour circle for "#RRGGBB"
 * - a text tile for "=…" (numbers are shown with both 1 2 3 and ١ ٢ ٣)
 * - otherwise the emoji character itself
 */
export function Pic({ item, size = 'md' }: { item: Pick<Item, 'pic' | 'img'>; size?: Size }) {
  const { pic, img } = item

  if (img) {
    return <img src={`/pics/${img}.svg`} alt="" aria-hidden="true" loading="lazy" draggable={false} className={`${BOX[size]} select-none`} />
  }

  if (pic.startsWith('#')) {
    return <span aria-hidden="true" className={`${BOX[size]} inline-block rounded-full border-[3px] border-ink/15`} style={{ background: pic }} />
  }

  if (pic.startsWith('=')) {
    const text = pic.slice(1)
    const numeric = /^\d+$/.test(text)
    const big = size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-xl' : 'text-3xl sm:text-4xl'
    return (
      <span
        aria-hidden="true"
        dir="ltr"
        className={`${size === 'lg' ? 'min-h-22 min-w-22' : size === 'sm' ? 'min-h-11 min-w-11' : 'min-h-16 min-w-16 sm:min-h-[72px] sm:min-w-[72px]'} inline-flex flex-col items-center justify-center rounded-2xl bg-tint px-2 leading-none font-extrabold text-primary-dark`}
      >
        <span className={`${big} font-[Fredoka]`}>{text}</span>
        {numeric && <span className={`${size === 'sm' ? 'text-xs' : 'text-base'} font-[Baloo_Bhaijaan_2] text-muted`}>{toArabicDigits(text)}</span>}
      </span>
    )
  }

  const text = size === 'lg' ? 'text-[80px]' : size === 'sm' ? 'text-[42px]' : 'text-[56px] sm:text-[64px]'
  return (
    <span aria-hidden="true" className={`${text} leading-none`}>
      {pic}
    </span>
  )
}

/** A topic's icon, as a picture when available */
export function TopicIcon({ icon, iconImg, className = 'size-14' }: { icon: string; iconImg?: string; className?: string }) {
  if (iconImg) return <img src={`/pics/${iconImg}.svg`} alt="" aria-hidden="true" className={className} />
  return (
    <span aria-hidden="true" className="text-[52px] leading-none">
      {icon}
    </span>
  )
}
