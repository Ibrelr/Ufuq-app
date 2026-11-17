import { CONVERSATIONS, GRAMMAR, LEVELS, LEVEL_STYLE, READINGS } from '../content'
import { GrammarCard } from '../components/GrammarCard'
import { useLanguage } from '../i18n/LanguageProvider'
import { ConversationCard, ReadingCard } from '../components/LessonCards'
import { UiIcon } from '../components/Pic'

/** All conversations (/talk) or all reading texts (/read), grouped by level. */
export function LessonListPage({ kind }: { kind: 'talk' | 'read' | 'grammar' }) {
  const { t, name } = useLanguage()
  const items = kind === 'talk' ? CONVERSATIONS : kind === 'read' ? READINGS : GRAMMAR
  return (
    <>
      <div className="flex items-center gap-4 pt-8 pb-2">
        <UiIcon emoji={kind === 'talk' ? '💬' : kind === 'read' ? '📖' : '📐'} className="size-12" />
        <h1 className="font-display m-0 text-[clamp(2rem,4vw,2.8rem)] leading-tight">{kind === 'talk' ? t.talkTitle : kind === 'read' ? t.readTitle : t.grammarTitle}</h1>
      </div>
      <p className="mt-0 mb-6 text-lg text-muted">{kind === 'talk' ? t.talkText : kind === 'read' ? t.readText : t.grammarText}</p>
      {LEVELS.map((l) => {
        const list = items.filter((x) => x.level === l.id)
        if (!list.length) return null
        return (
          <section key={l.id} className="mb-8">
            <h2 className="mb-3 flex items-center gap-2.5 text-2xl">
              <span className={`${LEVEL_STYLE[l.id].bg} rounded-lg px-2 py-0.5 font-[Fredoka] font-semibold text-white`}>{l.code}</span>
              <span className="font-display">{name(l.name)}</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {kind === 'talk'
                ? CONVERSATIONS.filter((c) => c.level === l.id).map((c) => <ConversationCard key={c.id} convo={c} />)
                : kind === 'read'
                  ? READINGS.filter((r) => r.level === l.id).map((r) => <ReadingCard key={r.id} reading={r} />)
                  : GRAMMAR.filter((g) => g.level === l.id).map((g) => <GrammarCard key={g.id} lesson={g} />)}
            </div>
          </section>
        )
      })}
    </>
  )
}
