/** Shared class strings, so buttons look the same everywhere. */
const base =
  'inline-flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-6 text-lg font-extrabold no-underline transition-transform active:translate-y-[3px] disabled:cursor-not-allowed'

export const btn = {
  primary: `${base} bg-primary text-white shadow-[0_4px_0_var(--color-primary-dark)]`,
  sun: `${base} bg-sun text-ink shadow-[0_4px_0_var(--color-sun-dark)]`,
  ok: `${base} bg-ok text-white shadow-[0_4px_0_var(--color-ok-ink)]`,
  bad: `${base} bg-bad text-white shadow-[0_4px_0_var(--color-bad-ink)]`,
  ghost: `${base} border-2 border-primary bg-surface text-primary-dark`,
}

export const pill =
  'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-line bg-surface px-4 text-base font-extrabold text-ink no-underline hover:border-primary'

export const card = 'rounded-3xl border border-line bg-surface'
