# أُفق · Ufuq

A free website for learning **English from Arabic**, or **Arabic from English**. Picture cards say their name when you tap them, every topic has a self-correcting quiz, and the content runs from A1 to C1.

Built for learners in Syria and anywhere else: it works on cheap Android phones, it can be installed to the home screen, and it keeps working offline once a topic has been opened (PWA).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build in dist/
npm run preview   # serve dist/ locally
npm run lint      # oxlint
```

Node 20 or newer.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (design tokens in `src/index.css`)
- React Router
- vite-plugin-pwa (Workbox) for offline use and install

## How it is organised

```
content/
  topics.csv               # one row per topic: order, level, type, icon, names
  words.csv                # one row per word or sentence (the main spreadsheet)
scripts/
  build-content.mjs        # CSV → src/content/generated/topics.json + public/pics/*.svg
src/
  content/
    levels.json            # A1–C1: names and descriptions in both languages
    index.ts               # loads the generated topics
  i18n/
    strings.ts             # all interface text, Arabic and English
    LanguageProvider.tsx   # learning direction, html lang/dir (rtl/ltr)
  lib/
    speech.ts              # recorded audio first, browser speech as fallback
    useSpeak.tsx           # speech + "no voice on this device" message
    progress.tsx           # stars per topic (localStorage for now)
    quiz.ts                # builds the 8-question quizzes
  components/              # Layout, WordCard, LearnView, QuizView, Pic, …
  pages/                   # Home, LevelPage, TopicPage, NotFound
public/
  audio/manifest.json      # list of recorded audio files (empty for now)
  _redirects               # SPA fallback for Netlify / Cloudflare Pages
```

`src/content/generated/` and `public/pics/` are generated and not committed.
`npm run dev` and `npm run build` regenerate them; run `npm run content` by hand after editing the CSV files.

### Learning direction

`ar2en` (default): an Arabic speaker learns English, the interface is Arabic and right-to-left.
`en2ar`: an English speaker learns Arabic, the interface is English and left-to-right.
Use logical Tailwind classes (`ms-*`, `ps-*`, `start-*`, `text-start`) so both directions work.

### Adding content (no coding needed)

All words live in two spreadsheets. Open them in Google Sheets or Excel, edit, and export as **CSV UTF-8** over the old file.

`content/words.csv`

| topic | id | pic | en | ar |
|---|---|---|---|---|
| fruits | | 🍎 | Apple | تفاحة |
| numbers | | =12 | Twelve | اثنا عشر |
| colors | | #E5484D | Red | أحمر |

- `topic`: an id from `topics.csv`.
- `id`: leave empty and it is made from the English word. Fill it in only if two words would get the same id. Audio files are named after it, so don't change it later.
- `pic`: an emoji (shown as a Fluent Emoji picture), `#RRGGBB` for a colour circle, or `=text` for a text tile (numbers also show Arabic-Indic digits).
- Sentences with a comma must be in quotes in the CSV (the spreadsheet does this for you).

`content/topics.csv` sets each topic's order, level (`a1`–`c1`), type (`words` or `phrases`), icon and names.

The script stops with a clear message if something is wrong (unknown topic, missing translation, duplicate id) and warns about emojis that have no Fluent picture.

### Pictures

Pictures come from [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT, see `THIRD_PARTY_NOTICES.md`), via `@iconify-json/fluent-emoji-flat`. Only the pictures in use are written to `public/pics/`, and the app caches each one the first time it is shown.

In a quiz, a picture is only used as a question or answer if no other word in the topic has the same picture (days of the week all use 📅, so they are asked in words).

### Recorded audio (next step)

Browser speech works out of the box, but many phones have no Arabic voice. To use recorded files:

1. Put files at `public/audio/{lang}/{topicId}/{itemId}.mp3`, e.g. `public/audio/ar/fruits/apple.mp3`.
2. List them in `public/audio/manifest.json`: `["ar/fruits/apple", "en/fruits/apple"]`.

Listed files play instead of browser speech and are cached for offline use.

## Deploying

Any static host works. Cloudflare Pages or Netlify (free):
build command `npm run build`, output folder `dist`. `public/_redirects` sends every route to `index.html`.

## Next steps

- [ ] Recorded audio for all items (Arabic and English)
- [ ] PNG app icons (192/512) for older Android launchers
- [ ] Photos for words that have no emoji (Wikimedia Commons / Pexels, with credits)
- [ ] Search and saved word lists ("My collections")
- [ ] Accounts and synced progress (backend)
