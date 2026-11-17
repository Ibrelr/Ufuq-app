import { Link } from 'react-router-dom'
import { LEVEL_STYLE, type Conversation, type Reading } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useStats } from '../lib/stats'
import { TopicIcon } from './Pic'

const base =
  'relative flex items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4 text-ink no-underline shadow-[0_4px_0_var(--color-line)] hover:border-primary'

function DoneTick({ label }: { label: string }) {
  return (
    <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-ok-tint px-2 py-0.5 text-xs font-extrabold text-ok-ink">
      ✓ {label}
    </span>
  )
}

export function ConversationCard({ convo }: { convo: Conversation }) {
  const { t, name } = useLanguage()
  const { isDone } = useStats()
  const done = isDone(`talk:${convo.id}`)
  return (
    <Link to={`/talk/${convo.id}`} className={base}>
      {done && <DoneTick label={t.finished} />}
      <div className="relative flex-none">
        <TopicIcon icon={convo.icon} iconImg={convo.iconImg} className="size-14" />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className={`${LEVEL_STYLE[convo.level].bg} rounded-md px-1.5 font-[Fredoka] text-sm font-semibold text-white`}>{convo.level.toUpperCase()}</span>
          <span className="text-sm font-bold text-muted">{t.linesN(convo.lines.length)}</span>
        </span>
        <b className="font-display pe-16 text-xl leading-tight">{name(convo.title)}</b>
        <span className="line-clamp-2 text-sm text-muted">{name(convo.setting)}</span>
        <span className="mt-1 flex -space-x-2 rtl:space-x-reverse">
          {convo.speakers.map((sp) => (
            <span key={sp.id} className="rounded-full border-2 border-surface bg-bg p-0.5">
              <TopicIcon icon={sp.icon} iconImg={sp.iconImg} className="size-7" />
            </span>
          ))}
        </span>
      </div>
    </Link>
  )
}

export function ReadingCard({ reading }: { reading: Reading }) {
  const { t, name, target } = useLanguage()
  const { isDone } = useStats()
  const done = isDone(`read:${reading.id}`)
  return (
    <Link to={`/read/${reading.id}`} className={base}>
      {done && <DoneTick label={t.finished} />}
      <TopicIcon icon={reading.icon} iconImg={reading.iconImg} className="size-14 flex-none" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className={`${LEVEL_STYLE[reading.level].bg} rounded-md px-1.5 font-[Fredoka] text-sm font-semibold text-white`}>{reading.level.toUpperCase()}</span>
          <span className="text-sm font-bold text-muted">{t.sentencesN(reading.sentences.length)}</span>
        </span>
        <b className="font-display pe-16 text-xl leading-tight">{name(reading.title)}</b>
        <span lang={target} dir="auto" className="line-clamp-2 text-sm text-muted">
          {reading.sentences[0][target]}
        </span>
      </div>
    </Link>
  )
}
