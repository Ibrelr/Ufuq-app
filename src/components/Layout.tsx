import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { useProgress } from '../lib/progress'
import { useSpeak } from '../lib/useSpeak'
import { Logo, StarIcon } from './Icons'
import { pill } from './ui'

export function Layout() {
  const { t, direction, setDirection } = useLanguage()
  const { total } = useProgress()
  const { stop } = useSpeak()
  const { pathname } = useLocation()

  // New page: stop any sound and start at the top
  useEffect(() => {
    stop()
    window.scrollTo(0, 0)
  }, [pathname, stop])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-30 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        {t.home}
      </a>
      <header className="sticky top-0 z-10 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5 text-ink no-underline">
            <Logo />
            <span>
              <b className="font-display block text-[28px] leading-none">{t.brand}</b>
              <small className="hidden text-sm leading-tight text-muted sm:block">{t.brandSub}</small>
            </span>
          </Link>
          <nav aria-label={t.home} className="ms-auto flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-tint px-3.5 py-2 text-base font-extrabold text-sun-ink">
              <StarIcon on size={20} />
              <span aria-hidden="true">{total}</span>
              <span className="sr-only">{t.stars(total)}</span>
            </span>
            <button type="button" className={pill} onClick={() => setDirection(direction === 'ar2en' ? 'en2ar' : 'ar2en')}>
              {direction === 'ar2en' ? <span lang="en">I’m learning Arabic</span> : <span lang="ar">أتعلّم الإنجليزية</span>}
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5">
        <Outlet />
      </main>

      <footer className="mt-6 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-5 pt-6 pb-8 text-[15px] text-muted">
          <b>{t.footer}</b>
          <span>{t.tip}</span>
          <span className="text-sm">{t.credits}</span>
        </div>
      </footer>
    </div>
  )
}
