import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { ALL_ENTRIES, entryKey } from '../lib/entries'
import { normalize } from '../lib/normalize'
import { SearchIcon } from '../components/Icons'
import { WordCard } from '../components/WordCard'

const INDEX = ALL_ENTRIES.map((e) => ({ e, en: normalize(e.item.en), ar: normalize(e.item.ar) }))
const MAX = 60

export function SearchPage() {
  const { t, name } = useLanguage()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')

  const results = useMemo(() => {
    const n = normalize(q)
    if (!n) return []
    // Words that start with the search come first, then words that contain it
    const starts = INDEX.filter((x) => x.en.startsWith(n) || x.ar.startsWith(n))
    const contains = INDEX.filter((x) => !starts.includes(x) && (x.en.includes(n) || x.ar.includes(n)))
    return [...starts, ...contains].map((x) => x.e)
  }, [q])

  return (
    <>
      <h1 className="font-display mt-8 mb-2 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{t.searchTitle}</h1>
      <p className="mt-0 mb-5 text-muted">{t.searchHint}</p>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="sticky top-[73px] z-[5] -mx-5 mb-5 bg-bg px-5 py-2"
      >
        <label className="flex min-h-15 items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 focus-within:border-primary">
          <SearchIcon size={26} />
          <span className="sr-only">{t.searchTitle}</span>
          <input
            type="search"
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })
            }}
            placeholder={t.searchPlaceholder}
            dir="auto"
            className="min-w-0 flex-1 border-0 bg-transparent py-3 text-xl font-bold outline-none placeholder:font-normal placeholder:text-muted"
          />
        </label>
      </form>

      {q.trim() && (
        <p aria-live="polite" className="mt-0 mb-4 font-extrabold text-muted">
          {results.length ? t.resultsN(results.length) : t.noResults(q.trim())}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3.5 pb-12 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
        {results.slice(0, MAX).map((e) => (
          <WordCard
            key={entryKey(e)}
            item={e.item}
            topicId={e.topic.id}
            label={
              <Link to={`/topic/${e.topic.id}`} className="text-muted no-underline hover:underline">
                {name(e.topic.name)}
              </Link>
            }
          />
        ))}
      </div>
    </>
  )
}
