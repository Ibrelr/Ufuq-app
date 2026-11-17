/**
 * Makes text comparable for search and pronunciation checks:
 * lower case, no punctuation, and Arabic spelled the simple way
 * (no vowel marks, أ إ آ → ا, ة → ه, ى → ي).
 */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // tashkeel and tatweel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[’'`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 1 = identical, 0 = nothing in common (Levenshtein distance scaled by length) */
export function similarity(a: string, b: string) {
  a = normalize(a)
  b = normalize(b)
  if (!a.length && !b.length) return 1
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return 1 - prev[b.length] / Math.max(a.length, b.length)
}
