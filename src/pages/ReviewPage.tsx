import { useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { entriesFromKeys } from '../lib/entries'
import { useStats } from '../lib/stats'
import { PracticeSet } from '../components/PracticeSet'

export function ReviewPage() {
  const { t } = useLanguage()
  const { reviewKeys } = useStats()
  const entries = useMemo(() => entriesFromKeys(reviewKeys), [reviewKeys])
  return <PracticeSet title={t.reviewTitle} text={t.reviewText} empty={t.reviewEmpty} icon="🔁" entries={entries} />
}
