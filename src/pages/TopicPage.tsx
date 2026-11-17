import { useEffect, useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getLevel, getTopic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { topicEntries } from '../lib/entries'
import { useProgress } from '../lib/progress'
import { useStats } from '../lib/stats'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { LearnView } from '../components/LearnView'
import { MatchGame } from '../components/MatchGame'
import { TopicIcon, UiIcon } from '../components/Pic'
import { QuizView } from '../components/QuizView'
import { SpeakGame } from '../components/SpeakGame'
import { SpellGame } from '../components/SpellGame'
import { spellableEntries } from '../lib/spell'
import { Stars } from '../components/Stars'
import { NotFound } from './NotFound'

export type Mode = 'learn' | 'quiz' | 'match' | 'spell' | 'speak'
const MODES: { mode: Mode; emoji: string }[] = [
  { mode: 'learn', emoji: '📖' },
  { mode: 'quiz', emoji: '❓' },
  { mode: 'match', emoji: '🧩' },
  { mode: 'spell', emoji: '🔤' },
  { mode: 'speak', emoji: '🎤' },
]

export function TopicPage() {
  const { topicId = '', mode: modeParam } = useParams()
  const mode: Mode = (MODES.find((m) => m.mode === modeParam)?.mode ?? 'learn') as Mode
  const { t, ui, target, name, altName } = useLanguage()
  const { stars } = useProgress()
  const { visitTopic } = useStats()
  const topic = getTopic(topicId)
  const level = topic && getLevel(topic.level)
  const pool = useMemo(() => (topic ? topicEntries(topic) : []), [topic])

  useEffect(() => {
    if (topic) visitTopic(topic.id)
  }, [topic, visitTopic])

  if (!topic || !level) return <NotFound />

  const canSpell = spellableEntries(pool, target).length >= 4
  const modes = MODES.filter((m) => m.mode !== 'spell' || canSpell)
  const label = { learn: t.learn, quiz: t.quiz, match: t.match, spell: t.spell, speak: t.speak }

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

      {/* Activities: scrolls sideways on small phones */}
      <nav aria-label={name(topic.name)} className="-mx-5 mb-5 overflow-x-auto px-5 pb-1">
        <div className="flex min-w-max gap-2.5">
          {modes.map((m) => (
            <NavLink
              key={m.mode}
              end
              to={m.mode === 'learn' ? `/topic/${topic.id}` : `/topic/${topic.id}/${m.mode}`}
              className="flex min-h-14 items-center gap-2.5 rounded-2xl border-2 border-line bg-surface px-4 py-2 text-ink no-underline hover:border-primary aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-white"
            >
              <UiIcon emoji={m.emoji} className="size-7" />
              <span className="flex flex-col text-start leading-tight">
                <b className="text-[17px]">{label[m.mode]}</b>
                <small className="hidden text-xs opacity-80 sm:block">{t.activityHint[m.mode]}</small>
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {mode === 'learn' && <LearnView key={topic.id} topic={topic} />}
      {mode === 'quiz' && <QuizView key={topic.id} pool={pool} topic={topic} />}
      {mode === 'match' && <MatchGame key={topic.id} pool={pool} topic={topic} />}
      {mode === 'spell' && canSpell && <SpellGame key={topic.id} pool={pool} topic={topic} />}
      {mode === 'speak' && <SpeakGame key={topic.id} pool={pool} topic={topic} />}
    </>
  )
}
