import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { useStats } from '../lib/stats'
import { useSpeak } from '../lib/useSpeak'
import { ChatIcon, FlameIcon, HeartIcon, HomeIcon, Logo, MapIcon, SearchIcon } from './Icons'
import { pill } from './ui'

const iconLink =
  'inline-flex size-11 items-center justify-center rounded-full text-ink no-underline hover:bg-tint aria-[current=page]:bg-ink aria-[current=page]:text-white'

export function Layout() {
  const { t, direction, setDirection } = useLanguage()
  const { streak } = useStats()
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
          <nav aria-label={t.home} className="ms-auto flex items-center gap-1.5 sm:gap-2.5">
            {/* On phones these move to the tab bar at the bottom */}
            <NavLink to="/search" aria-label={t.search} title={t.search} className={`${iconLink} sm:hidden`}>
              <SearchIcon size={22} />
            </NavLink>
            <span className="hidden items-center gap-2.5 sm:flex">
              <NavLink to="/course" aria-label={t.course} title={t.course} className={iconLink}>
                <MapIcon size={24} />
              </NavLink>
              <NavLink to="/talk" aria-label={t.conversations} title={t.conversations} className={iconLink}>
                <ChatIcon size={24} />
              </NavLink>
              <NavLink to="/search" aria-label={t.search} title={t.search} className={iconLink}>
                <SearchIcon size={24} />
              </NavLink>
              <NavLink to="/saved" aria-label={t.saved} title={t.saved} className={iconLink}>
                <HeartIcon size={24} />
              </NavLink>
            </span>
            <NavLink to="/progress" aria-label={`${t.progress}: ${t.streakDays(streak)}`} title={t.progress} className={`${iconLink} w-auto gap-1 px-2.5 font-extrabold`}>
              <FlameIcon size={24} lit={streak > 0} />
              <span aria-hidden="true">{streak}</span>
            </NavLink>
            <button
              type="button"
              className={`${pill} min-h-11 px-3 sm:px-4`}
              onClick={() => setDirection(direction === 'ar2en' ? 'en2ar' : 'ar2en')}
              title={direction === 'ar2en' ? 'I’m learning Arabic' : 'أتعلّم الإنجليزية'}
            >
              {direction === 'ar2en' ? (
                <span lang="en">
                  <span className="sm:hidden">EN</span>
                  <span className="hidden sm:inline">I’m learning Arabic</span>
                </span>
              ) : (
                <span lang="ar">
                  <span className="sm:hidden">ع</span>
                  <span className="hidden sm:inline">أتعلّم الإنجليزية</span>
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5">
        <Outlet />
      </main>

      {/* Tab bar for phones */}
      <nav aria-label={t.home} className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden">
        {[
          { to: '/', label: t.home, icon: <HomeIcon size={24} /> },
          { to: '/talk', label: t.conversations, icon: <ChatIcon size={24} /> },
          { to: '/course', label: t.course, icon: <MapIcon size={24} /> },
          { to: '/saved', label: t.saved, icon: <HeartIcon size={24} /> },
          { to: '/progress', label: t.progress, icon: <FlameIcon size={24} lit={streak > 0} /> },
        ].map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className="flex min-h-15 flex-col items-center justify-center gap-0.5 text-[11px] font-extrabold text-muted no-underline aria-[current=page]:text-primary-dark"
          >
            {tab.icon}
            <span className="max-w-full truncate px-1">{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <footer className="mt-6 border-t border-line pb-16 sm:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-5 pt-6 pb-8 text-[15px] text-muted">
          <b>{t.footer}</b>
          <span>{t.tip}</span>
          <span className="text-sm">{t.credits}</span>
        </div>
      </footer>
    </div>
  )
}
