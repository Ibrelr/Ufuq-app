import { Link } from 'react-router-dom'
import { LEVELS, LEVEL_STYLE, topicsForLevel } from '../content'
import { useLanguage, type Direction } from '../i18n/LanguageProvider'
import { useProgress } from '../lib/progress'
import { Mascot, StarIcon } from '../components/Icons'
import { btn, card } from '../components/ui'

const STAIR_HEIGHTS = ['h-[60px]', 'h-[108px]', 'h-[156px]', 'h-[204px]', 'h-[252px]']

export function Home() {
  const { t, ui, target, direction, setDirection, name } = useLanguage()
  const { levelStars } = useProgress()

  const dirButton = (d: Direction, lang: 'ar' | 'en', label: string) => (
    <button
      type="button"
      lang={lang}
      aria-pressed={direction === d}
      onClick={() => setDirection(d)}
      className="min-h-13 cursor-pointer rounded-2xl border-2 border-line bg-surface px-5 text-[17px] font-extrabold aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
    >
      {label}
    </button>
  )

  return (
    <>
      <section className="flex flex-wrap items-center gap-10 pt-12 pb-8">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4.5">
          <span className="self-start rounded-full bg-sun-tint px-3.5 py-1.5 text-[15px] font-extrabold text-sun-ink">{t.tag}</span>
          <h1 className="font-display m-0 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.15]">{t.heroTitle}</h1>
          <p className="m-0 max-w-[34rem] text-xl text-muted">{t.heroText}</p>
          <div>
            <div className="mb-2 font-extrabold">{t.chooseDir}</div>
            <div role="group" className="flex flex-wrap gap-2.5">
              {dirButton('ar2en', 'ar', 'أتعلّم الإنجليزية')}
              {dirButton('en2ar', 'en', 'I’m learning Arabic')}
            </div>
          </div>
          <div>
            <Link to="/level/a1" className={btn.primary}>
              {t.start}
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_380px] justify-center">
          {/* The staircase always climbs left to right, like the logo */}
          <div dir="ltr" className={`${card} relative flex h-80 w-full max-w-[460px] items-end gap-2.5 rounded-[28px] p-6`}>
            {LEVELS.map((l, i) => (
              <Link
                key={l.id}
                to={`/level/${l.id}`}
                aria-label={`${l.code} ${name(l.name)}`}
                className={`${LEVEL_STYLE[l.id].bg} ${STAIR_HEIGHTS[i]} flex flex-1 justify-center rounded-xl pt-2.5 font-[Fredoka] text-xl font-semibold text-white no-underline`}
              >
                {l.code}
              </Link>
            ))}
            <div className="absolute top-5 left-6 flex items-center gap-2.5">
              <Mascot size={72} />
              <span lang={target} className="rounded-2xl bg-tint px-3.5 py-2 text-lg font-extrabold">
                {t.bubble}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-7">
        <h2 className="font-display mb-4.5 text-3xl">{t.howTitle}</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {t.how.map(([title, text], i) => (
            <div key={i} className={`${card} flex items-start gap-3.5 rounded-[20px] p-5`}>
              <span className="flex size-10.5 flex-none items-center justify-center rounded-full bg-primary text-xl font-extrabold text-white">{i + 1}</span>
              <div>
                <b className="block text-[19px]">{title}</b>
                <span className="text-base text-muted">{text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-7">
        <h2 className="font-display mb-4.5 text-3xl">{t.levelsTitle}</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {LEVELS.map((l) => {
            const s = LEVEL_STYLE[l.id]
            const { got, max } = levelStars(l.id)
            return (
              <Link
                key={l.id}
                to={`/level/${l.id}`}
                className={`${card} ${s.border} flex flex-col gap-2.5 border-t-8 p-5.5 text-ink no-underline hover:shadow-[0_6px_0_var(--color-line)]`}
              >
                <span className={`${s.bg} self-start rounded-[10px] px-3 py-1 font-[Fredoka] text-lg font-semibold text-white`}>{l.code}</span>
                <h3 className="font-display m-0 text-2xl leading-tight">{name(l.name)}</h3>
                <p className="m-0 text-base text-muted">{l.description[ui]}</p>
                <div className="h-2.5 overflow-hidden rounded-full bg-track" aria-hidden="true">
                  <i className={`${s.bg} block h-full rounded-full`} style={{ width: `${Math.round((got / max) * 100)}%` }} />
                </div>
                <div className="mt-auto flex items-center justify-between text-[15px] font-extrabold text-muted">
                  <span>{t.topicsN(topicsForLevel(l.id).length)}</span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon on size={18} />
                    <span dir="ltr">
                      {got} / {max}
                    </span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
