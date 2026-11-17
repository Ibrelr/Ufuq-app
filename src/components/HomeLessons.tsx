import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONVERSATIONS, READINGS } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { ConversationCard, ReadingCard } from './LessonCards'
import { UiIcon } from './Pic'

/** Home page rows that lead to real conversations and reading texts. */
export function HomeLessons() {
  const { t } = useLanguage()
  const row = (emoji: string, title: string, text: string, to: string, children: ReactNode) => (
    <section className="py-6">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <UiIcon emoji={emoji} className="size-10" />
        <div className="flex flex-col">
          <h2 className="font-display m-0 text-3xl">{title}</h2>
          <p className="m-0 text-muted">{text}</p>
        </div>
        <Link to={to} className="ms-auto font-extrabold text-primary-dark">
          {t.seeAll} ({to === '/talk' ? CONVERSATIONS.length : READINGS.length})
        </Link>
      </div>
      {children}
    </section>
  )
  return (
    <>
      {row(
        '💬',
        t.talkTitle,
        t.talkText,
        '/talk',
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {['cafe', 'neighbour', 'job-centre'].map((id) => {
            const c = CONVERSATIONS.find((x) => x.id === id)
            return c && <ConversationCard key={id} convo={c} />
          })}
        </div>,
      )}
      {row(
        '📖',
        t.readTitle,
        t.readText,
        '/read',
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {['my-family', 'new-beginning', 'aleppo'].map((id) => {
            const r = READINGS.find((x) => x.id === id)
            return r && <ReadingCard key={id} reading={r} />
          })}
        </div>,
      )}
    </>
  )
}
