import { Link, NavLink, useParams } from 'react-router-dom'
import { getGrammar, type GrammarLesson } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { GrammarPractice } from '../components/GrammarPractice'
import { SpeakerIcon } from '../components/Icons'
import { TopicIcon, UiIcon } from '../components/Pic'
import { btn, card } from '../components/ui'
import { MixedText } from '../components/MixedText'
import { modeTab } from './ConversationPage'
import { NotFound } from './NotFound'

export function GrammarPage() {
  const { id = '', mode = 'learn' } = useParams()
  const { t, name } = useLanguage()
  const { markDone } = useStats()
  const lesson = getGrammar(id)
  if (!lesson) return <NotFound />

  return (
    <>
      <Breadcrumbs items={[{ label: t.grammarTitle, to: '/grammar' }, { label: name(lesson.title) }]} />
      <div className="flex flex-wrap items-center gap-4 pt-3 pb-4">
        <TopicIcon icon={lesson.icon} iconImg={lesson.iconImg} className="size-14" />
        <h1 className="font-display m-0 text-[clamp(1.7rem,4vw,2.5rem)] leading-tight">{name(lesson.title)}</h1>
      </div>
      <nav className="mb-5 flex flex-wrap gap-2.5" aria-label={name(lesson.title)}>
        <NavLink end to={`/grammar/${lesson.id}`} className={modeTab}>
          <UiIcon emoji="📖" className="size-7" />
          <b className="text-[17px]">{t.learn}</b>
        </NavLink>
        <NavLink to={`/grammar/${lesson.id}/practise`} className={modeTab}>
          <UiIcon emoji="🧩" className="size-7" />
          <b className="text-[17px]">{t.practise}</b>
          <small className="opacity-75">{t.exercisesN(lesson.exercises.length)}</small>
        </NavLink>
      </nav>
      {mode === 'practise' ? <GrammarPractice key={lesson.id} lesson={lesson} onFinish={() => markDone(`grammar:${lesson.id}`)} /> : <Explain lesson={lesson} />}
    </>
  )
}

function Explain({ lesson }: { lesson: GrammarLesson }) {
  const { t, ui } = useLanguage()
  const { speakText } = useSpeak()
  return (
    <div className="mx-auto max-w-3xl pb-12">
      <section className={`${card} border-s-8 border-s-primary p-5 sm:p-6`}>
        <h2 className="font-display mt-0 mb-3 flex items-center gap-2 text-2xl">
          <UiIcon emoji="📐" className="size-8" /> {t.theRule}
        </h2>
        <p lang={ui} className="m-0 text-xl leading-loose">
          {ui === 'ar' ? <MixedText text={lesson.rule.ar} /> : lesson.rule.en}
        </p>
        {ui === 'ar' && (
          <p lang="en" dir="ltr" className="mt-3 mb-0 rounded-2xl bg-bg p-3 text-base text-muted">
            {lesson.rule.en}
          </p>
        )}
      </section>

      <section className={`${card} mt-5 p-5 sm:p-6`}>
        <h2 className="font-display mt-0 mb-4 text-2xl">{t.examples}</h2>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {lesson.examples.map((ex, i) => (
            <li key={i}>
              <button type="button" onClick={() => speakText(ex.en, 'en')} className="flex w-full cursor-pointer items-start gap-3 rounded-2xl border-2 border-line bg-surface p-3 text-start hover:border-primary">
                <span className="flex-none rounded-full bg-primary p-2 text-white">
                  <SpeakerIcon size={18} />
                </span>
                <span className="flex flex-col">
                  <b lang="en" dir="ltr" className="text-xl">
                    {ex.en}
                  </b>
                  <span lang="ar" dir="rtl" className="text-lg text-muted">
                    {ex.ar}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex justify-center">
        <Link to={`/grammar/${lesson.id}/practise`} className={btn.primary}>
          <UiIcon emoji="🧩" className="size-6" /> {t.practise}
        </Link>
      </div>
    </div>
  )
}
