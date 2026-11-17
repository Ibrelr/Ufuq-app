import { useMemo, useState } from 'react'
import type { Topic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { entryKey, type Entry } from '../lib/entries'
import { shuffle } from '../lib/quiz'
import { ALPHABET, spellableEntries, spellLetters } from '../lib/spell'
import { useSpeak } from '../lib/useSpeak'
import { useStats } from '../lib/stats'
import { ActivityResult } from './ActivityResult'
import { SpeakerIcon } from './Icons'
import { Pic } from './Pic'
import { ProgressBar } from './ProgressBar'
import { btn, card } from './ui'

const ROUNDS = 6
/** Listen, look at the picture, and build the word from letter tiles. */
export function SpellGame({ pool, topic }: { pool: Entry[]; topic?: Topic }) {
  const { t, target } = useLanguage()
  const [round, setRound] = useState(0)
  const words = useMemo(() => shuffle(spellableEntries(pool, target)).slice(0, ROUNDS), [pool, target, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const { finishActivity } = useStats()

  const again = () => {
    setIndex(0)
    setScore(0)
    setRound((r) => r + 1)
  }

  if (index >= words.length) {
    return <ActivityResult stars={Math.round((score / Math.max(1, words.length)) * 3)} message={t.spellDone(score, words.length)} score={`${score} / ${words.length}`} onAgain={again} topic={topic} />
  }

  return (
    <SpellRound
      key={`${round}-${index}`}
      entry={words[index]}
      index={index}
      total={words.length}
      onDone={(ok) => {
        if (ok) setScore((s) => s + 1)
        if (index === words.length - 1) finishActivity()
        setIndex((i) => i + 1)
      }}
    />
  )
}

function SpellRound({ entry, index, total, onDone }: { entry: Entry; index: number; total: number; onDone: (ok: boolean) => void }) {
  const { t, target, native, tgt, nat } = useLanguage()
  const { speakItem } = useSpeak()
  const { answer } = useStats()
  const letters = useMemo(() => spellLetters(tgt(entry.item), target) ?? [], [entry, target, tgt])
  const tiles = useMemo(() => {
    const decoys = shuffle([...ALPHABET[target]].filter((c) => !letters.includes(c))).slice(0, 2)
    return shuffle([...letters, ...decoys]).map((c, i) => ({ c, id: i }))
  }, [letters, target])
  const [placed, setPlaced] = useState<number[]>([])
  const [result, setResult] = useState<null | boolean>(null)

  const hear = () => speakItem(entry.item, entry.topic.id)
  const built = placed.map((id) => tiles.find((x) => x.id === id)!.c).join('')

  const check = () => {
    const ok = built === letters.join('')
    setResult(ok)
    answer(entryKey(entry), ok)
    hear()
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <ProgressBar value={index + (result !== null ? 1 : 0)} max={total} label={`${index + 1} / ${total}`} />
      <div className={`${card} flex flex-col items-center gap-5 rounded-[26px] p-5 text-center sm:p-6`}>
        <p className="m-0 self-stretch text-start text-lg font-extrabold text-muted">{t.spellHint}</p>
        <div className="flex items-center gap-4">
          <Pic item={entry.item} size="lg" />
          <button
            type="button"
            onClick={hear}
            aria-label={t.hear}
            className="flex size-16 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-white shadow-[0_4px_0_var(--color-primary-dark)] active:translate-y-1"
          >
            <SpeakerIcon size={30} />
          </button>
        </div>
        <span lang={native} className="text-xl text-muted">
          {nat(entry.item)}
        </span>

        {/* The word being built. Arabic letters join up naturally because it is one string. */}
        <div
          lang={target}
          dir={target === 'ar' ? 'rtl' : 'ltr'}
          aria-live="polite"
          className={`flex min-h-18 min-w-[60%] items-center justify-center rounded-2xl border-2 border-dashed px-5 text-4xl font-extrabold tracking-wide ${
            result === null ? 'border-line' : result ? 'border-ok bg-ok-tint text-ok-ink' : 'border-bad bg-bad-tint text-bad-ink'
          }`}
        >
          {built || <span className="text-2xl text-line">{'_ '.repeat(letters.length)}</span>}
        </div>

        <div lang={target} dir={target === 'ar' ? 'rtl' : 'ltr'} className="flex flex-wrap justify-center gap-2.5">
          {tiles.map((tile) => {
            const used = placed.includes(tile.id)
            return (
              <button
                key={tile.id}
                type="button"
                disabled={result !== null}
                onClick={() => setPlaced((p) => (used ? p.filter((x) => x !== tile.id) : [...p, tile.id]))}
                aria-pressed={used}
                className={`size-14 cursor-pointer rounded-2xl border-2 text-2xl font-extrabold transition sm:size-16 sm:text-3xl ${
                  used ? 'border-line bg-track text-muted' : 'border-line bg-surface shadow-[0_4px_0_var(--color-line)] hover:border-primary'
                }`}
              >
                {tile.c}
              </button>
            )
          })}
        </div>

        {result === null ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" className={btn.sun} disabled={placed.length === 0} onClick={check}>
              {t.check}
            </button>
            <button type="button" className={btn.ghost} onClick={() => setPlaced([])}>
              {t.clear}
            </button>
          </div>
        ) : (
          <div role="status" className={`flex w-full flex-col items-center gap-3 rounded-[20px] border-2 p-4 ${result ? 'border-ok bg-ok-tint text-ok-ink' : 'border-bad bg-bad-tint text-bad-ink'}`}>
            <b className="text-xl">{result ? t.spellCorrect : t.spellWrong}</b>
            {!result && (
              <span lang={target} className="text-3xl font-extrabold">
                {tgt(entry.item)}
              </span>
            )}
            <button type="button" className={result ? btn.ok : btn.bad} onClick={() => onDone(result)} autoFocus>
              {index === total - 1 ? t.seeResult : t.next2}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
