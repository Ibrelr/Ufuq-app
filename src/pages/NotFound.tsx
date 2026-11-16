import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { Mascot } from '../components/Icons'
import { btn } from '../components/ui'

export function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <Mascot size={110} />
      <h1 className="font-display m-0 text-3xl">{t.notFound}</h1>
      <Link to="/" className={btn.primary}>
        {t.home}
      </Link>
    </div>
  )
}
