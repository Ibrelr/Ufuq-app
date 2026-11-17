import type { Lang } from '../content'

export interface Strings {
  brand: string
  brandSub: string
  home: string
  tag: string
  heroTitle: string
  heroText: string
  start: string
  chooseDir: string
  bubble: string
  howTitle: string
  how: [string, string][]
  levelsTitle: string
  topicsN: (n: number) => string
  words: (n: number) => string
  phrases: (n: number) => string
  learn: string
  quiz: string
  playAll: string
  stop: string
  slow: string
  hear: string
  hearNative: string
  tapHint: string
  qListenPic: string
  qNative: string
  qListenText: string
  qPicText: string
  playAgain: string
  correct: string
  wrong: string
  next: string
  seeResult: string
  resultTitle: string
  again: string
  backTopic: string
  nextTopic: string
  backLevels: string
  great: string
  good: string
  keep: string
  ok: string
  bad: string
  noSpeech: string
  noVoice: Record<Lang, string>
  footer: string
  tip: string
  stars: (n: number) => string
  notFound: string
  option: (n: number) => string
  credits: string
  // navigation
  back: string
  search: string
  saved: string
  progress: string
  // activities
  match: string
  spell: string
  speak: string
  activityHint: Record<'learn' | 'quiz' | 'match' | 'spell' | 'speak' | 'build', string>
  check: string
  clear: string
  skip: string
  next2: string
  wellDone: string
  xpGain: (n: number) => string
  // match
  matchHint: string
  moves: (n: number) => string
  matchDone: (moves: number) => string
  // spell
  spellHint: string
  spellCorrect: string
  spellWrong: string
  spellDone: (score: number, total: number) => string
  // speak
  speakHint: string
  speakTap: string
  listening: string
  heard: string
  speakGood: string
  speakTry: string
  speakUnsupported: string
  speakNetwork: string
  speakDone: (score: number, total: number) => string
  // today
  todayTitle: string
  goal: (xp: number, goal: number) => string
  goalReached: string
  streakDays: (n: number) => string
  continueTopic: string
  wordOfDay: string
  reviewN: (n: number) => string
  savedN: (n: number) => string
  // saved / review
  savedTitle: string
  savedText: string
  savedEmpty: string
  practiceThese: string
  needFour: string
  reviewTitle: string
  reviewText: string
  reviewEmpty: string
  saveWord: string
  unsaveWord: string
  // search
  searchTitle: string
  searchPlaceholder: string
  searchHint: string
  noResults: (q: string) => string
  resultsN: (n: number) => string
  // progress
  progressTitle: string
  totalXp: string
  streakLabel: string
  learnedWords: string
  starsEarned: string
  weekTitle: string
  weekdays: string[]
  achievements: string
  badges: Record<BadgeId, [string, string]>
  // conversations and reading
  conversations: string
  reading: string
  talkTitle: string
  talkText: string
  readTitle: string
  readText: string
  topicsHeading: string
  linesN: (n: number) => string
  sentencesN: (n: number) => string
  listen: string
  roleplay: string
  practise: string
  listenHint: string
  showTranslation: string
  playConversation: string
  chooseRole: string
  roleplayHint: string
  yourTurn: string
  sayIt: string
  showLine: string
  continue: string
  roleplayDone: string
  buildHint: string
  gapHint: string
  meaningHint: string
  whoSaid: string
  readAloud: string
  tapSentence: string
  vocabulary: string
  finished: string
  build: string
  read: string
  grammar: string
  grammarTitle: string
  grammarText: string
  theRule: string
  examples: string
  exercisesN: (n: number) => string
  grammarHint: string
  course: string
  courseTitle: string
  courseText: string
  nextStep: string
  startStep: string
  stepKind: Record<'words' | 'phrases' | 'grammar' | 'talk' | 'read', string>
  stepsDone: (done: number, total: number) => string
  levelDone: string
  practiseDone: (score: number, total: number) => string
  seeAll: string
}

export type BadgeId = 'first' | 'streak3' | 'streak7' | 'words50' | 'words200' | 'stars30' | 'saved10' | 'xp1000'

/**
 * Arabic counted nouns: 1 → "كلمة واحدة", 2 → "كلمتان", 3–10 → plural, 11+ → singular.
 * [singular, dual, plural, "one" adjective]
 */
function arCount(n: number, [one, two, many, oneAdj]: [string, string, string, string]) {
  if (n === 1) return `${one} ${oneAdj}`
  if (n === 2) return two
  if (n >= 3 && n <= 10) return `${n} ${many}`
  return `${n} ${one}`
}
const WORD: [string, string, string, string] = ['كلمة', 'كلمتان', 'كلمات', 'واحدة']
const SENTENCE: [string, string, string, string] = ['جملة', 'جملتان', 'جمل', 'واحدة']
const TOPIC: [string, string, string, string] = ['موضوع', 'موضوعان', 'موضوعات', 'واحد']
const TRY: [string, string, string, string] = ['محاولة', 'محاولتان', 'محاولات', 'واحدة']
const RESULT: [string, string, string, string] = ['نتيجة', 'نتيجتان', 'نتائج', 'واحدة']

const ar: Strings = {
  brand: 'أُفق',
  brandSub: 'تعلّم خطوة بخطوة',
  home: 'الرئيسية',
  tag: 'مجاني للجميع · من A1 إلى C1',
  heroTitle: 'تعلّم الإنجليزية خطوة بخطوة',
  heroText: 'اضغط على الصورة لتسمع الكلمة بالإنجليزية، ثم اختبر نفسك. للصغار والكبار.',
  start: 'ابدأ من A1',
  chooseDir: 'ماذا تريد أن تتعلّم؟',
  bubble: 'Hello!',
  howTitle: 'كيف تتعلّم؟',
  how: [
    ['اختر مستوى', 'ابدأ من A1 إذا كنت مبتدئاً.'],
    ['اضغط واستمع', 'كل صورة تنطق اسمها. كرّر بصوت عالٍ.'],
    ['اختبر نفسك', 'أجب عن الأسئلة واجمع النجوم.'],
  ],
  levelsTitle: 'المستويات',
  topicsN: (n) => arCount(n, TOPIC),
  words: (n) => arCount(n, WORD),
  phrases: (n) => arCount(n, SENTENCE),
  learn: 'تعلّم',
  quiz: 'اختبر نفسك',
  playAll: 'استمع إلى الكل',
  stop: 'إيقاف',
  slow: 'ببطء',
  hear: 'استمع',
  hearNative: 'بالعربية',
  tapHint: 'اضغط على أي بطاقة لتسمع نطقها بالإنجليزية.',
  qListenPic: 'استمع، ثم اختر الصورة الصحيحة',
  qNative: 'اختر الترجمة الإنجليزية الصحيحة',
  qListenText: 'استمع، ثم اختر ما سمعته',
  qPicText: 'ما اسم هذه الصورة بالإنجليزية؟',
  playAgain: 'استمع مرة أخرى',
  correct: 'أحسنت! إجابة صحيحة',
  wrong: 'ليس تماماً. الإجابة الصحيحة:',
  next: 'السؤال التالي',
  seeResult: 'عرض النتيجة',
  resultTitle: 'انتهى الاختبار!',
  again: 'أعد المحاولة',
  backTopic: 'العودة إلى الدرس',
  nextTopic: 'الموضوع التالي',
  backLevels: 'كل المستويات',
  great: 'ممتاز! استمر هكذا.',
  good: 'جيد جداً! تدرّب قليلاً بعد.',
  keep: 'لا بأس، استمع إلى الكلمات مرة أخرى ثم حاول.',
  ok: 'صحيح ✓',
  bad: 'خطأ ✕',
  noSpeech: 'هذا المتصفح لا يدعم النطق الصوتي. جرّب Chrome أو Safari.',
  noVoice: {
    ar: 'لا يوجد صوت عربي على هذا الجهاز. أضِفه من إعدادات اللغة والكلام.',
    en: 'لا يوجد صوت إنجليزي على هذا الجهاز. أضِفه من إعدادات اللغة والكلام.',
  },
  footer: 'أُفق — موقع مجاني لكل من يريد أن يتعلّم.',
  tip: 'نصيحة: إذا لم تسمع صوتاً، ارفع الصوت وتأكد أن جهازك فيه صوت للغة الإنجليزية والعربية في إعدادات الكلام.',
  stars: (n) => `${n} من 3 نجوم`,
  notFound: 'لم نجد هذه الصفحة.',
  option: (n) => `الخيار ${n}`,
  credits: 'الصور: Microsoft Fluent Emoji (رخصة MIT)',
  back: 'رجوع',
  search: 'بحث',
  saved: 'كلماتي',
  progress: 'تقدّمي',
  match: 'طابِق',
  spell: 'تهجَّ',
  speak: 'انطق',
  activityHint: {
    learn: 'شاهد واستمع',
    quiz: 'أسئلة سريعة',
    match: 'صِل الصورة بالكلمة',
    spell: 'رتّب الحروف',
    speak: 'قل الكلمة بصوتك',
    build: 'رتّب كلمات الجملة',
  },
  check: 'تحقّق',
  clear: 'امسح',
  skip: 'تخطَّ',
  next2: 'التالي',
  wellDone: 'أحسنت!',
  xpGain: (n) => `+${n} نقطة`,
  matchHint: 'اضغط على صورة، ثم على الكلمة التي تناسبها.',
  moves: (n) => arCount(n, TRY),
  matchDone: (m) => `أنهيت اللعبة في ${arCount(m, TRY)}!`,
  spellHint: 'استمع، ثم رتّب الحروف لتكتب الكلمة بالإنجليزية.',
  spellCorrect: 'صحيح! كتبت الكلمة بشكل صحيح.',
  spellWrong: 'ليس تماماً. الكلمة الصحيحة:',
  spellDone: (s, t) => `كتبت ${s} من ${t} بشكل صحيح.`,
  speakHint: 'اضغط على الميكروفون وقل الكلمة بالإنجليزية.',
  speakTap: 'اضغط وتكلّم',
  listening: 'أستمع إليك…',
  heard: 'سمعت:',
  speakGood: 'رائع! نطقك واضح.',
  speakTry: 'قريب! استمع مرة أخرى وحاول من جديد.',
  speakUnsupported: 'هذا المتصفح لا يدعم التعرّف على الصوت. جرّب Chrome على أندرويد أو الحاسوب.',
  speakNetwork: 'التعرّف على الصوت يحتاج إلى اتصال بالإنترنت والسماح باستخدام الميكروفون.',
  speakDone: (s, t) => `نطقت ${s} من ${t} بشكل صحيح.`,
  todayTitle: 'اليوم',
  goal: (x, g) => `${x} من ${g} نقطة`,
  goalReached: 'حقّقت هدف اليوم!',
  streakDays: (n) => (n === 1 ? 'يوم واحد متتالٍ' : `${n} أيام متتالية`),
  continueTopic: 'تابع من حيث توقفت',
  wordOfDay: 'كلمة اليوم',
  reviewN: (n) => `راجع ${arCount(n, WORD)}`,
  savedN: (n) => (n === 0 ? 'لا توجد كلمات محفوظة' : `${arCount(n, WORD)} محفوظة`),
  savedTitle: 'كلماتي',
  savedText: 'الكلمات التي حفظتها بالضغط على القلب.',
  savedEmpty: 'لم تحفظ أي كلمة بعد. اضغط على القلب ♡ في أي بطاقة لتحفظها هنا.',
  practiceThese: 'تدرّب على هذه الكلمات',
  needFour: 'احفظ 4 كلمات على الأقل لتتدرّب عليها.',
  reviewTitle: 'المراجعة',
  reviewText: 'الكلمات التي أخطأت فيها. أجب عن كل كلمة بشكل صحيح مرتين لتختفي من القائمة.',
  reviewEmpty: 'لا توجد كلمات للمراجعة. أحسنت!',
  saveWord: 'احفظ الكلمة',
  unsaveWord: 'أزل الكلمة من كلماتي',
  searchTitle: 'ابحث عن كلمة',
  searchPlaceholder: 'اكتب بالعربية أو بالإنجليزية…',
  searchHint: 'ابحث في كل الكلمات والجمل، بالعربية أو بالإنجليزية.',
  noResults: (q) => `لم نجد شيئاً لـ «${q}».`,
  resultsN: (n) => arCount(n, RESULT),
  progressTitle: 'تقدّمي',
  totalXp: 'مجموع النقاط',
  streakLabel: 'أيام متتالية',
  learnedWords: 'كلمات تعلّمتها',
  starsEarned: 'النجوم',
  weekTitle: 'آخر 7 أيام',
  weekdays: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  achievements: 'الأوسمة',
  conversations: 'المحادثات',
  reading: 'القراءة',
  talkTitle: 'تحدّث في مواقف حقيقية',
  talkText: 'استمع إلى محادثات من الحياة اليومية، ثم مثّل أحد الدورين بصوتك.',
  readTitle: 'اقرأ نصوصاً قصيرة',
  readText: 'نصوص سهلة ومتوسطة مع صوت وترجمة لكل جملة.',
  topicsHeading: 'كلمات وجمل',
  linesN: (n) => arCount(n, SENTENCE),
  sentencesN: (n) => arCount(n, SENTENCE),
  listen: 'استمع',
  roleplay: 'مثّل الدور',
  practise: 'تدرّب',
  listenHint: 'استمع إلى المحادثة كاملة، أو اضغط على أي جملة لتسمعها.',
  showTranslation: 'أظهر الترجمة',
  playConversation: 'شغّل المحادثة',
  chooseRole: 'اختر دورك',
  roleplayHint: 'سيقول التطبيق جمل الشخص الآخر. عندما يأتي دورك، قل جملتك بالإنجليزية.',
  yourTurn: 'دورك! قل هذه الجملة بالإنجليزية:',
  sayIt: 'قلها',
  showLine: 'أظهر الجملة',
  continue: 'تابع',
  roleplayDone: 'أنهيت المحادثة! أنت تتكلم الإنجليزية الآن.',
  buildHint: 'رتّب الكلمات لتكوّن الجملة الصحيحة.',
  gapHint: 'اختر الكلمة الناقصة.',
  meaningHint: 'ما معنى هذه الجملة؟',
  whoSaid: 'من قال هذا؟',
  readAloud: 'اقرأ النص بصوت عالٍ',
  tapSentence: 'اضغط على أي جملة لتسمعها وترى ترجمتها.',
  vocabulary: 'كلمات مهمة',
  finished: 'مكتمل',
  build: 'ابنِ الجملة',
  read: 'اقرأ',
  grammar: 'القواعد',
  grammarTitle: 'قواعد اللغة الإنجليزية',
  grammarText: 'دروس قصيرة مع شرح واضح بالعربية وأمثلة مسموعة وتمارين.',
  theRule: 'القاعدة',
  examples: 'أمثلة',
  exercisesN: (n) => arCount(n, ['تمرين', 'تمرينان', 'تمارين', 'واحد']),
  grammarHint: 'اختر الكلمة المناسبة لإكمال الجملة.',
  course: 'مساري',
  courseTitle: 'مسار تعلّمك',
  courseText: 'اتبع الخطوات بالترتيب: كلمات، ثم جمل، ثم قواعد، ثم محادثات وقراءة.',
  nextStep: 'الخطوة التالية',
  startStep: 'ابدأ',
  stepKind: { words: 'كلمات', phrases: 'جمل', grammar: 'قواعد', talk: 'محادثة', read: 'قراءة' },
  stepsDone: (d, t) => `${d} من ${t}`,
  levelDone: 'أكملت هذا المستوى!',
  practiseDone: (s, t) => `أجبت عن ${s} من ${t} بشكل صحيح.`,
  seeAll: 'عرض الكل',
  badges: {
    first: ['البداية', 'أنهِ أول نشاط'],
    streak3: ['3 أيام', 'تعلّم 3 أيام متتالية'],
    streak7: ['أسبوع كامل', 'تعلّم 7 أيام متتالية'],
    words50: ['50 كلمة', 'تعلّم 50 كلمة'],
    words200: ['200 كلمة', 'تعلّم 200 كلمة'],
    stars30: ['جامع النجوم', 'اجمع 30 نجمة'],
    saved10: ['جامع الكلمات', 'احفظ 10 كلمات'],
    xp1000: ['1000 نقطة', 'اجمع 1000 نقطة'],
  },
}

const en: Strings = {
  brand: 'Ufuq',
  brandSub: 'Step by step',
  home: 'Home',
  tag: 'Free for everyone · A1 to C1',
  heroTitle: 'Learn Arabic, step by step',
  heroText: 'Tap a picture to hear the word in Arabic, then test yourself. For children and adults.',
  start: 'Start at A1',
  chooseDir: 'What do you want to learn?',
  bubble: 'مرحبا!',
  howTitle: 'How it works',
  how: [
    ['Choose a level', 'Start at A1 if you are a beginner.'],
    ['Tap and listen', 'Every picture says its name. Repeat it out loud.'],
    ['Test yourself', 'Answer the questions and collect stars.'],
  ],
  levelsTitle: 'Levels',
  topicsN: (n) => `${n} topics`,
  words: (n) => `${n} words`,
  phrases: (n) => `${n} sentences`,
  learn: 'Learn',
  quiz: 'Test yourself',
  playAll: 'Listen to all',
  stop: 'Stop',
  slow: 'Slow',
  hear: 'Listen',
  hearNative: 'In English',
  tapHint: 'Tap any card to hear it in Arabic.',
  qListenPic: 'Listen, then choose the right picture',
  qNative: 'Choose the correct Arabic translation',
  qListenText: 'Listen, then choose what you heard',
  qPicText: 'What is this called in Arabic?',
  playAgain: 'Listen again',
  correct: 'Well done! That’s right',
  wrong: 'Not quite. The right answer is:',
  next: 'Next question',
  seeResult: 'See result',
  resultTitle: 'Quiz finished!',
  again: 'Try again',
  backTopic: 'Back to the lesson',
  nextTopic: 'Next topic',
  backLevels: 'All levels',
  great: 'Excellent! Keep it up.',
  good: 'Very good! Practise a little more.',
  keep: 'That’s OK. Listen to the words again, then try once more.',
  ok: 'Correct ✓',
  bad: 'Wrong ✕',
  noSpeech: 'This browser cannot speak words aloud. Try Chrome or Safari.',
  noVoice: {
    ar: 'There is no Arabic voice on this device. Add one in your language and speech settings.',
    en: 'There is no English voice on this device. Add one in your language and speech settings.',
  },
  footer: 'Ufuq — a free website for anyone who wants to learn.',
  tip: 'Tip: if you hear nothing, turn the volume up and check that your device has Arabic and English voices in its speech settings.',
  stars: (n) => `${n} of 3 stars`,
  notFound: 'We could not find this page.',
  option: (n) => `Option ${n}`,
  credits: 'Pictures: Microsoft Fluent Emoji (MIT licence)',
  back: 'Back',
  search: 'Search',
  saved: 'My words',
  progress: 'My progress',
  match: 'Match',
  spell: 'Spell',
  speak: 'Speak',
  activityHint: {
    learn: 'Look and listen',
    quiz: 'Quick questions',
    match: 'Match pictures and words',
    spell: 'Build the word',
    speak: 'Say it out loud',
    build: 'Put words in order',
  },
  check: 'Check',
  clear: 'Clear',
  skip: 'Skip',
  next2: 'Next',
  wellDone: 'Well done!',
  xpGain: (n) => `+${n} XP`,
  matchHint: 'Tap a picture, then the word that goes with it.',
  moves: (n) => (n === 1 ? '1 try' : `${n} tries`),
  matchDone: (m) => `You finished in ${m} tries!`,
  spellHint: 'Listen, then put the letters in order to write the word in Arabic.',
  spellCorrect: 'Correct! You spelled it right.',
  spellWrong: 'Not quite. The right word is:',
  spellDone: (s, t) => `You spelled ${s} of ${t} words correctly.`,
  speakHint: 'Tap the microphone and say the word in Arabic.',
  speakTap: 'Tap and speak',
  listening: 'Listening…',
  heard: 'I heard:',
  speakGood: 'Great! Your pronunciation is clear.',
  speakTry: 'Close! Listen again and try once more.',
  speakUnsupported: 'This browser can’t recognise speech. Try Chrome on Android or a computer.',
  speakNetwork: 'Speech recognition needs an internet connection and permission to use the microphone.',
  speakDone: (s, t) => `You said ${s} of ${t} words correctly.`,
  todayTitle: 'Today',
  goal: (x, g) => `${x} of ${g} XP`,
  goalReached: 'Daily goal reached!',
  streakDays: (n) => (n === 1 ? '1 day in a row' : `${n} days in a row`),
  continueTopic: 'Continue where you left off',
  wordOfDay: 'Word of the day',
  reviewN: (n) => (n === 1 ? 'Review 1 word' : `Review ${n} words`),
  savedN: (n) => (n === 1 ? '1 saved word' : `${n} saved words`),
  savedTitle: 'My words',
  savedText: 'Words you saved by tapping the heart.',
  savedEmpty: 'You haven’t saved any words yet. Tap the heart ♡ on any card to save it here.',
  practiceThese: 'Practise these words',
  needFour: 'Save at least 4 words to practise them.',
  reviewTitle: 'Review',
  reviewText: 'Words you got wrong. Answer each one correctly twice to clear it.',
  reviewEmpty: 'Nothing to review. Well done!',
  saveWord: 'Save word',
  unsaveWord: 'Remove from my words',
  searchTitle: 'Find a word',
  searchPlaceholder: 'Type in English or Arabic…',
  searchHint: 'Search every word and sentence, in English or Arabic.',
  noResults: (q) => `Nothing found for “${q}”.`,
  resultsN: (n) => (n === 1 ? '1 result' : `${n} results`),
  progressTitle: 'My progress',
  totalXp: 'Total XP',
  streakLabel: 'Day streak',
  learnedWords: 'Words learned',
  starsEarned: 'Stars',
  weekTitle: 'Last 7 days',
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  achievements: 'Badges',
  conversations: 'Conversations',
  reading: 'Reading',
  talkTitle: 'Speak in real situations',
  talkText: 'Listen to everyday conversations, then play one of the roles with your own voice.',
  readTitle: 'Read short texts',
  readText: 'Easy and intermediate texts with audio and a translation for every sentence.',
  topicsHeading: 'Words and sentences',
  linesN: (n) => (n === 1 ? '1 line' : `${n} lines`),
  sentencesN: (n) => (n === 1 ? '1 sentence' : `${n} sentences`),
  listen: 'Listen',
  roleplay: 'Role play',
  practise: 'Practise',
  listenHint: 'Listen to the whole conversation, or tap any line to hear it.',
  showTranslation: 'Show translation',
  playConversation: 'Play conversation',
  chooseRole: 'Choose your role',
  roleplayHint: 'The app says the other person’s lines. When it’s your turn, say your line in Arabic.',
  yourTurn: 'Your turn! Say this line in Arabic:',
  sayIt: 'Say it',
  showLine: 'Show the line',
  continue: 'Continue',
  roleplayDone: 'You finished the conversation! You’re speaking Arabic now.',
  buildHint: 'Put the words in order to make the sentence.',
  gapHint: 'Choose the missing word.',
  meaningHint: 'What does this sentence mean?',
  whoSaid: 'Who said this?',
  readAloud: 'Read the text aloud',
  tapSentence: 'Tap any sentence to hear it and see the translation.',
  vocabulary: 'Key words',
  finished: 'Finished',
  build: 'Build',
  read: 'Read',
  grammar: 'Grammar',
  grammarTitle: 'English grammar',
  grammarText: 'Short lessons with clear explanations, examples with audio, and exercises.',
  theRule: 'The rule',
  examples: 'Examples',
  exercisesN: (n) => (n === 1 ? '1 exercise' : `${n} exercises`),
  grammarHint: 'Choose the word that completes the sentence.',
  course: 'My course',
  courseTitle: 'Your learning path',
  courseText: 'Follow the steps in order: words, then sentences, grammar, conversations and reading.',
  nextStep: 'Next step',
  startStep: 'Start',
  stepKind: { words: 'Words', phrases: 'Sentences', grammar: 'Grammar', talk: 'Conversation', read: 'Reading' },
  stepsDone: (d, t) => `${d} of ${t}`,
  levelDone: 'You finished this level!',
  practiseDone: (s, t) => `You got ${s} of ${t} right.`,
  seeAll: 'See all',
  badges: {
    first: ['First step', 'Finish your first activity'],
    streak3: ['3 days', 'Learn 3 days in a row'],
    streak7: ['Full week', 'Learn 7 days in a row'],
    words50: ['50 words', 'Learn 50 words'],
    words200: ['200 words', 'Learn 200 words'],
    stars30: ['Star collector', 'Collect 30 stars'],
    saved10: ['Word collector', 'Save 10 words'],
    xp1000: ['1000 XP', 'Earn 1000 XP'],
  },
}

export const STRINGS: Record<Lang, Strings> = { ar, en }
