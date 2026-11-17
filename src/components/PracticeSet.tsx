import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { entryKey, type Entry } from '../lib/entries'
import { MatchGame } from './MatchGame'
import { Mascot } from './Icons'
import { UiIcon } from './Pic'
import { QuizView } from './QuizView'
import { WordCard } from './WordCard'
import { btn, card } from './ui'

interface Props {
  title: string
  text: string
  empty: string
  icon: string
  entries: Entry[]
}

/** A list of words from any topics (saved words, words to review) with quiz and match practice. */
export function PracticeSet({ title, text, empty, icon, entries }: Props) {
  const { t, name } = useLanguage()
  const [mode, setMode] = useState<'list' | 'quiz' | 'match'>('list')
  // Keep the set fixed while practising, even if words leave the list
  const [frozen, setFrozen] = useState<Entry[] | null>(null)
  const pool = frozen ?? entries
  const enough = pool.length >= 4

  const start = (m: 'quiz' | 'match') => {
    setFrozen(entries)
    setMode(m)
  }
  const back = () => {
    setFrozen(null)
    setMode('list')
  }

  let body: ReactNode
  if (!entries.length && mode === 'list') {
    body = (
      <div className={`${card} flex flex-col items-center gap-4 p-10 text-center`}>
        <Mascot size={100} />
        <p className="m-0 max-w-md text-lg">{empty}</p>
        <Link to="/" className={btn.primary}>
          {t.home}
        </Link>
      </div>
    )
  } else if (mode === 'quiz') body = <QuizView pool={pool} />
  else if (mode === 'match') body = <MatchGame pool={pool} />
  else
    body = (
      <div className="grid grid-cols-2 gap-3.5 pb-12 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
        {entries.map((e) => (
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
    )

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 pt-8 pb-3">
        <UiIcon emoji={icon} className="size-12" />
        <h1 className="font-display m-0 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{title}</h1>
        <span className="rounded-full bg-tint px-3 py-1 font-extrabold text-primary-dark">{entries.length}</span>
      </div>
      <p className="mt-0 mb-5 text-muted">{text}</p>

      {entries.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2.5">
          {mode !== 'list' ? (
            <button type="button" className={btn.ghost} onClick={back}>
              {t.back}
            </button>
          ) : enough ? (
            <>
              <button type="button" className={btn.primary} onClick={() => start('quiz')}>
                <UiIcon emoji="❓" className="size-6" /> {t.quiz}
              </button>
              <button type="button" className={btn.sun} onClick={() => start('match')}>
                <UiIcon emoji="🧩" className="size-6" /> {t.match}
              </button>
            </>
          ) : (
            <p className="m-0 font-bold text-muted">{t.needFour}</p>
          )}
        </div>
      )}
      {body}
    </>
  )
}
