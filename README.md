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
src/
  content/
    levels.json            # A1–C1: names and descriptions in both languages
    topics/NN-<id>.json    # one file per topic; the number sets the order
    index.ts               # loads every topic file automatically
  i18n/
    strings.ts             # all interface text, Arabic and English
    LanguageProvider.tsx   # learning direction, html lang/dir (rtl/ltr)
  lib/
    speech.ts              # recorded audio first, browser speech as fallback
    useSpeak.tsx           # speech + "no voice on this device" message
    progress.tsx           # stars per topic (localStorage for now)
    quiz.ts                # builds the 8-question quizzes
  components/              # Layout, WordCard, LearnView, QuizView, …
  pages/                   # Home, LevelPage, TopicPage, NotFound
public/
  audio/manifest.json      # list of recorded audio files (empty for now)
  _redirects               # SPA fallback for Netlify / Cloudflare Pages
```

### Learning direction

`ar2en` (default): an Arabic speaker learns English, the interface is Arabic and right-to-left.
`en2ar`: an English speaker learns Arabic, the interface is English and left-to-right.
Use logical Tailwind classes (`ms-*`, `ps-*`, `start-*`, `text-start`) so both directions work.

### Adding content

Add or edit a file in `src/content/topics/`. Nothing else needs to change.

```json
{
  "id": "fruits",
  "level": "a1",
  "type": "words",
  "icon": "🍎",
  "name": { "ar": "الفواكه", "en": "Fruit" },
  "items": [
    { "id": "apple", "pic": "🍎", "en": "Apple", "ar": "تفاحة" }
  ]
}
```

- `type`: `"words"` gives a card grid and picture questions, `"phrases"` gives a list and text questions.
- `pic`: an emoji, or a hex colour like `"#E5484D"` (shown as a colour circle).
- `id`: keep it stable; audio files are named after it.

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
- [ ] More topics per level
- [ ] Accounts and synced progress (backend)
