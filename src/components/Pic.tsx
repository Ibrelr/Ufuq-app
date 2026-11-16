/** Shows an item's picture: an emoji, or a colour swatch when `pic` is a hex colour. */
export function Pic({ pic, size = 'md' }: { pic: string; size?: 'sm' | 'md' | 'lg' }) {
  if (pic.startsWith('#')) {
    const dim = size === 'lg' ? 'size-22' : size === 'sm' ? 'size-11' : 'size-16'
    return <span aria-hidden="true" className={`${dim} inline-block rounded-full border-[3px] border-ink/15`} style={{ background: pic }} />
  }
  const text = size === 'lg' ? 'text-[80px]' : size === 'sm' ? 'text-[42px]' : 'text-[56px] sm:text-[64px]'
  return (
    <span aria-hidden="true" className={`${text} leading-none`}>
      {pic}
    </span>
  )
}
