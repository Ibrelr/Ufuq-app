import { useMemo, useState } from 'react'
import type { Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { entryKey, type Entry } from '../lib/entries'
import { pictureEntries, shuffle } from '../lib/quiz'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { Pic } from './Pic'
import { ProgressBar } from './ProgressBar'

const PAIRS = 6

/** Tap a picture (or the word in your own language), then the matching word in the language you're learning. */
export function MatchGame({ pool, topic }: { pool: Entry[]; topic?: Topic }) {
  const [round, setRound] = useState(0)
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem } = useSpeak()
  const { answer, finishActivity } = useStats()

  const { pairs, usePictures } = useMemo(() => {
    const withPics = pictureEntries(pool)
    const usePictures = withPics.length >= 4
    const pairs = shuffle(usePictures ? withPics : pool).slice(0, PAIRS)
    return { pairs, usePictures }
  }, [pool, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const left = useMemo(() => shuffle(pairs), [pairs])
  const right = useMemo(() => shuffle(pairs), [pairs])

  const [selLeft, setSelLeft] = useState<Entry | null>(null)
  const [selRight, setSelRight] = useState<Entry | null>(null)
  const [matched, setMatched] = useState<Set<Entry>>(new Set())
  const [wrong, setWrong] = useState<[Entry, Entry] | null>(null)
  const [moves, setMoves] = useState(0)

  const reset = () => {
    setSelLeft(null)
    setSelRight(null)
    setMatched(new Set())
    setWrong(null)
    setMoves(0)
    setRound((r) => r + 1)
  }

  const tryPair = (l: Entry | null, r: Entry | null) => {
    if (!l || !r) return
    setMoves((m) => m + 1)
    if (l === r) {
      const next = new Set(matched).add(l)
      setMatched(next)
      speakItem(l.item, l.topic.id)
      answer(entryKey(l), true)
      if (next.size === pairs.length) finishActivity()
    } else {
      setWrong([l, r])
      window.setTimeout(() => setWrong(null), 700)
    }
    setSelLeft(null)
    setSelRight(null)
  }

  if (pairs.length && matched.size === pairs.length) {
    const stars = moves <= pairs.length ? 3 : moves <= pairs.length + 3 ? 2 : 1
    return <ActivityResult stars={stars} message={t.matchDone(moves)} onAgain={reset} topic={topic} />
  }

  const tile = (e: Entry, side: 'l' | 'r') => {
    const isMatched = matched.has(e)
    const isSel = side === 'l' ? selLeft === e : selRight === e
    const isWrong = wrong && (side === 'l' ? wrong[0] === e : wrong[1] === e)
    const cls = isMatched
      ? 'border-ok bg-ok-tint text-ok-ink opacity-70'
      : isWrong
        ? 'border-bad bg-bad-tint text-bad-ink animate-[shake_.35s_ease-in-out]'
        : isSel
          ? 'border-primary bg-tint text-primary-dark shadow-[0_4px_0_var(--color-primary)]'
          : 'border-line bg-surface shadow-[0_4px_0_var(--color-line)] hover:border-primary'
    return (
      <button
        key={side + entryKey(e)}
        type="button"
        disabled={isMatched}
        aria-pressed={isSel}
        onClick={() => {
          if (side === 'l') {
            setSelLeft(e)
            tryPair(e, selRight)
          } else {
            setSelRight(e)
            speakItem(e.item, e.topic.id)
            tryPair(selLeft, e)
          }
        }}
        className={`flex min-h-20 cursor-pointer items-center justify-center rounded-[18px] border-2 p-2 text-center text-lg font-extrabold transition disabled:cursor-default sm:text-xl ${cls}`}
      >
        {side === 'l' ? (
          usePictures ? (
            <Pic item={e.item} size="sm" />
          ) : (
            <span lang={native} dir="auto">
              {nat(e.item)}
            </span>
          )
        ) : (
          <span lang={target} dir="auto">
            {tgt(e.item)}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <ProgressBar value={matched.size} max={pairs.length} label={t.moves(moves)} />
      <p className="mt-0 mb-4 text-lg font-extrabold text-muted">{t.matchHint}</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-3">{left.map((e) => tile(e, 'l'))}</div>
        <div className="flex flex-col gap-3">{right.map((e) => tile(e, 'r'))}</div>
      </div>
    </div>
  )
}
