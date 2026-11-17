import { Link, useParams } from 'react-router-dom'
import { conversationsForLevel, getLevel, LEVEL_STYLE, readingsForLevel, topicsForLevel } from '../content'
import { ConversationCard, ReadingCard } from '../components/LessonCards'
import { useLanguage } from '../i18n/LanguageProvider'
import { useProgress } from '../lib/progress'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { TopicIcon } from '../components/Pic'
import { Stars } from '../components/Stars'
import { NotFound } from './NotFound'

export function LevelPage() {
  const { levelId = '' } = useParams()
  const { t, ui, name, altName } = useLanguage()
  const { stars } = useProgress()
  const level = getLevel(levelId)
  if (!level) return <NotFound />

  return (
    <>
      <Breadcrumbs items={[{ label: level.code }]} />
      <div className="flex flex-wrap items-center gap-4 pt-3 pb-5">
        <span className={`${LEVEL_STYLE[level.id].bg} rounded-[10px] px-3 py-1 font-[Fredoka] text-2xl font-semibold text-white`}>{level.code}</span>
        <h1 className="font-display m-0 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{name(level.name)}</h1>
        <p className="m-0 basis-full text-muted">{level.description[ui]}</p>
      </div>

      {conversationsForLevel(level.id).length > 0 && (
        <section className="pb-8">
          <h2 className="font-display mt-0 mb-3 text-2xl">{t.talkTitle}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {conversationsForLevel(level.id).map((c) => (
              <ConversationCard key={c.id} convo={c} />
            ))}
          </div>
        </section>
      )}
      {readingsForLevel(level.id).length > 0 && (
        <section className="pb-8">
          <h2 className="font-display mt-0 mb-3 text-2xl">{t.readTitle}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {readingsForLevel(level.id).map((r) => (
              <ReadingCard key={r.id} reading={r} />
            ))}
          </div>
        </section>
      )}

      <h2 className="font-display mt-0 mb-3 text-2xl">{t.topicsHeading}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 pb-10">
        {topicsForLevel(level.id).map((tp) => (
          <Link
            key={tp.id}
            to={`/topic/${tp.id}`}
            className="flex flex-col items-center gap-1.5 rounded-3xl border-2 border-line bg-surface px-4 py-5.5 text-center text-ink no-underline shadow-[0_4px_0_var(--color-line)] hover:border-primary"
          >
            <TopicIcon icon={tp.icon} iconImg={tp.iconImg} className="size-16" />
            <b className="font-display text-[22px] leading-tight">{name(tp.name)}</b>
            <span className="text-base text-muted" lang={ui === 'ar' ? 'en' : 'ar'}>
              {altName(tp.name)}
            </span>
            <span className="text-sm font-extrabold text-muted">
              {tp.type === 'words' ? t.words(tp.items.length) : t.phrases(tp.items.length)}
            </span>
            <Stars n={stars(tp.id)} />
          </Link>
        ))}
      </div>
    </>
  )
}
