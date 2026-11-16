import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { t } = useLanguage()
  const all = [{ label: t.home, to: '/' }, ...items]
  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 pt-6 text-base font-bold text-muted">
      {all.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span aria-hidden="true">›</span>}
          {c.to ? (
            <Link to={c.to} className="text-primary-dark no-underline hover:underline">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page">{c.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
