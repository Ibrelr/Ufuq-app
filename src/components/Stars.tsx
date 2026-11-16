import { useLanguage } from '../i18n/LanguageProvider'
import { StarIcon } from './Icons'

export function Stars({ n, size = 22 }: { n: number; size?: number }) {
  const { t } = useLanguage()
  return (
    <span role="img" aria-label={t.stars(n)} className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <StarIcon key={i} on={i <= n} size={size} />
      ))}
    </span>
  )
}
