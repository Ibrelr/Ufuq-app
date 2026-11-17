import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { useCourse } from '../lib/useCourse'
import { TopicIcon } from './Pic'
import { btn } from './ui'

/** The home page's big "next step in your course" banner. */
export function NextStepCard() {
  const { t, name } = useLanguage()
  const { next, done, total } = useCourse()
  if (!next) return null
  return (
    <section className="my-4 flex flex-wrap items-center gap-5 rounded-[28px] bg-primary p-5 text-white sm:p-6">
      <div className="flex size-20 flex-none items-center justify-center rounded-full bg-white/95">
        <TopicIcon icon={next.icon} iconImg={next.iconImg} className="size-12" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-extrabold tracking-wide text-[#E3E9FF] uppercase">
          {t.nextStep} · {next.level.toUpperCase()} · {t.stepKind[next.kind]}
        </span>
        <b className="font-display text-2xl leading-tight sm:text-3xl">{name(next.title)}</b>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-2.5 w-40 overflow-hidden rounded-full bg-white/25">
            <i className="block h-full rounded-full bg-sun" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="text-sm font-bold text-[#E3E9FF]">{t.stepsDone(done, total)}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Link to={next.to} className={btn.sun}>
          {t.startStep}
        </Link>
        <Link to="/course" className="inline-flex min-h-14 items-center rounded-2xl border-2 border-white/60 px-5 font-extrabold text-white no-underline hover:bg-white/10">
          {t.courseTitle}
        </Link>
      </div>
    </section>
  )
}
