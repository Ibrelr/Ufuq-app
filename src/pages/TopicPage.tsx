import { NavLink, useParams } from 'react-router-dom'
import { getLevel, getTopic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useProgress } from '../lib/progress'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { LearnView } from '../components/LearnView'
import { QuizView } from '../components/QuizView'
import { TopicIcon } from '../components/Pic'
import { Stars } from '../components/Stars'
import { NotFound } from './NotFound'

const tab =
  'inline-flex min-h-12 items-center rounded-full border-2 border-line bg-surface px-5 text-[17px] font-extrabold text-ink no-underline aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-white'

export function TopicPage({ mode }: { mode: 'learn' | 'quiz' }) {
  const { topicId = '' } = useParams()
  const { t, ui, name, altName } = useLanguage()
  const { stars } = useProgress()
  const topic = getTopic(topicId)
  const level = topic && getLevel(topic.level)
  if (!topic || !level) return <NotFound />

  return (
    <>
      <Breadcrumbs items={[{ label: `${level.code} · ${name(level.name)}`, to: `/level/${level.id}` }, { label: name(topic.name) }]} />

      <div className="flex flex-wrap items-center gap-4 pt-3 pb-5">
        <TopicIcon icon={topic.icon} iconImg={topic.iconImg} className="size-14" />
        <h1 className="font-display m-0 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{name(topic.name)}</h1>
        <span lang={ui === 'ar' ? 'en' : 'ar'} className="text-xl text-muted">
          {altName(topic.name)}
        </span>
        <span className="ms-auto">
          <Stars n={stars(topic.id)} />
        </span>
      </div>

      <nav className="flex flex-wrap gap-2.5 pb-4.5" aria-label={name(topic.name)}>
        <NavLink end to={`/topic/${topic.id}`} className={tab}>
          {t.learn}
        </NavLink>
        <NavLink to={`/topic/${topic.id}/quiz`} className={tab}>
          {t.quiz}
        </NavLink>
      </nav>

      {mode === 'learn' ? <LearnView key={topic.id} topic={topic} /> : <QuizView key={topic.id} topic={topic} />}
    </>
  )
}
