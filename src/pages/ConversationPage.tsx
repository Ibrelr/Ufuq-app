import { useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getConversation, getLevel } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useStats } from '../lib/stats'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ChatView } from '../components/ChatView'
import { TopicIcon, UiIcon } from '../components/Pic'
import { RolePlay } from '../components/RolePlay'
import { SentencePractice } from '../components/SentencePractice'
import { NotFound } from './NotFound'

const MODES = [
  { mode: 'listen', emoji: '🎧' },
  { mode: 'roleplay', emoji: '🎭' },
  { mode: 'practise', emoji: '🧩' },
] as const

export const modeTab =
  'flex min-h-14 items-center gap-2.5 rounded-2xl border-2 border-line bg-surface px-4 py-2 text-ink no-underline hover:border-primary aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-white'

export function ConversationPage() {
  const { id = '', mode = 'listen' } = useParams()
  const { t, name } = useLanguage()
  const { markDone } = useStats()
  const convo = getConversation(id)
  const level = convo && getLevel(convo.level)
  const sentences = useMemo(
    () => convo?.lines.map((l, i) => ({ en: l.en, ar: l.ar, key: `talk:${convo.id}/${i}`, speaker: convo.speakers.find((s) => s.id === l.speaker) })) ?? [],
    [convo],
  )
  if (!convo || !level) return <NotFound />
  const label = { listen: t.listen, roleplay: t.roleplay, practise: t.practise }
  const done = () => markDone(`talk:${convo.id}`)

  return (
    <>
      <Breadcrumbs items={[{ label: t.conversations, to: '/talk' }, { label: name(convo.title) }]} />
      <div className="flex flex-wrap items-center gap-4 pt-3 pb-2">
        <TopicIcon icon={convo.icon} iconImg={convo.iconImg} className="size-14" />
        <h1 className="font-display m-0 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">{name(convo.title)}</h1>
      </div>
      <p className="mt-0 mb-4 text-lg text-muted">{name(convo.setting)}</p>

      <nav className="-mx-5 mb-5 overflow-x-auto px-5 pb-1" aria-label={name(convo.title)}>
        <div className="flex min-w-max gap-2.5">
          {MODES.map((m) => (
            <NavLink key={m.mode} end to={m.mode === 'listen' ? `/talk/${convo.id}` : `/talk/${convo.id}/${m.mode}`} className={modeTab}>
              <UiIcon emoji={m.emoji} className="size-7" />
              <b className="text-[17px]">{label[m.mode]}</b>
            </NavLink>
          ))}
        </div>
      </nav>

      {mode === 'listen' && <ChatView key={convo.id} convo={convo} />}
      {mode === 'roleplay' && <RolePlay key={convo.id} convo={convo} onDone={done} />}
      {mode === 'practise' && (
        <SentencePractice key={convo.id} sentences={sentences} types={['build', 'meaning', 'gap', 'who']} speakers={convo.speakers} onFinish={done} />
      )}
    </>
  )
}
