import { Link } from 'react-router-dom'
import { getTopic } from '../content'
import { useLanguage } from '../i18n/LanguageProvider'
import { entryKey, wordOfTheDay } from '../lib/entries'
import { DAILY_GOAL, useStats } from '../lib/stats'
import { useSpeak } from '../lib/useSpeak'
import { GoalRing } from './GoalRing'
import { FlameIcon, HeartIcon, SpeakerIcon } from './Icons'
import { Pic, TopicIcon, UiIcon } from './Pic'
import { btn, card } from './ui'

/** The home page's "Today" row: daily goal, streak, where to continue, word of the day, quick practice. */
export function TodayPanel() {
  const { t, target, native, tgt, nat, name } = useLanguage()
  const { todayXp, streak, lastTopic, reviewKeys, saved, isSaved, toggleSaved } = useStats()
  const { speakItem } = useSpeak()
  const wotd = wordOfTheDay()
  const wKey = entryKey(wotd)
  const cont = (lastTopic && getTopic(lastTopic)) || getTopic('greetings')

  return (
    <section className="grid gap-4 py-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr]" aria-label={t.todayTitle}>
      {/* Goal and streak */}
      <div className={`${card} flex items-center gap-5 p-5`}>
        <GoalRing xp={todayXp} size={112} />
        <div className="flex flex-col gap-2">
          <b className="font-display text-2xl">{todayXp >= DAILY_GOAL ? t.goalReached : t.todayTitle}</b>
          <span className="inline-flex items-center gap-1.5 font-extrabold text-[#B5530F]">
            <span className={streak > 0 ? 'animate-[flame_1.6s_ease-in-out_infinite]' : ''}>
              <FlameIcon size={28} lit={streak > 0} />
            </span>
            {t.streakDays(streak)}
          </span>
          {cont && (
            <Link to={`/topic/${cont.id}`} className={`${btn.primary} mt-1 min-h-12 px-4 text-base`}>
              <TopicIcon icon={cont.icon} iconImg={cont.iconImg} className="size-7" />
              <span className="truncate">{lastTopic ? name(cont.name) : t.start}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Word of the day */}
      <div className={`${card} relative flex items-center gap-4 p-5`}>
        <button
          type="button"
          onClick={() => toggleSaved(wKey)}
          aria-pressed={isSaved(wKey)}
          aria-label={isSaved(wKey) ? t.unsaveWord : t.saveWord}
          className={`absolute end-2 top-2 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent hover:bg-tint ${isSaved(wKey) ? 'text-bad' : 'text-line hover:text-muted'}`}
        >
          <HeartIcon filled={isSaved(wKey)} />
        </button>
        <button type="button" onClick={() => speakItem(wotd.item, wotd.topic.id)} aria-label={`${t.hear}: ${tgt(wotd.item)}`} className="flex-none cursor-pointer rounded-2xl border-0 bg-tint p-3">
          <Pic item={wotd.item} size="md" />
        </button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-extrabold tracking-wide text-muted uppercase">{t.wordOfDay}</span>
          <b lang={target} className="truncate text-3xl leading-tight">
            {tgt(wotd.item)}
          </b>
          <span lang={native} className="text-lg text-muted">
            {nat(wotd.item)}
          </span>
          <button type="button" onClick={() => speakItem(wotd.item, wotd.topic.id)} className="mt-1 inline-flex cursor-pointer items-center gap-1.5 self-start border-0 bg-transparent p-0 font-extrabold text-primary-dark">
            <SpeakerIcon size={20} /> {t.hear}
          </button>
        </div>
      </div>

      {/* Quick practice */}
      <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-1 lg:grid-cols-1">
        <Link to="/review" className={`${card} flex items-center gap-3 p-4 text-ink no-underline hover:border-primary`}>
          <UiIcon emoji="🔁" className="size-10" />
          <span className="flex flex-col">
            <b>{t.reviewTitle}</b>
            <span className="text-sm text-muted">{reviewKeys.length ? t.reviewN(reviewKeys.length) : t.reviewEmpty}</span>
          </span>
        </Link>
        <Link to="/saved" className={`${card} flex items-center gap-3 p-4 text-ink no-underline hover:border-primary`}>
          <UiIcon emoji="❤️" className="size-10" />
          <span className="flex flex-col">
            <b>{t.savedTitle}</b>
            <span className="text-sm text-muted">{t.savedN(saved.size)}</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
