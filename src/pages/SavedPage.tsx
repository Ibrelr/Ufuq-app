import { useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { entriesFromKeys } from '../lib/entries'
import { useStats } from '../lib/stats'
import { PracticeSet } from '../components/PracticeSet'

export function SavedPage() {
  const { t } = useLanguage()
  const { saved } = useStats()
  const entries = useMemo(() => entriesFromKeys(saved), [saved])
  return <PracticeSet title={t.savedTitle} text={t.savedText} empty={t.savedEmpty} icon="❤️" entries={entries} />
}
