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
}

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
  topicsN: (n) => `${n} موضوعات`,
  words: (n) => `${n} كلمات`,
  phrases: (n) => `${n} جمل`,
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
}

export const STRINGS: Record<Lang, Strings> = { ar, en }
