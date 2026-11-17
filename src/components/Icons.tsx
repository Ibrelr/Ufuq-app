type P = { size?: number; className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const SpeakerIcon = ({ size = 22, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} className={className} aria-hidden="true">
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
)

export const SlowIcon = ({ size = 20, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} className={className} aria-hidden="true">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2" />
    <path d="M10 2h4" />
  </svg>
)

export const PlayIcon = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
)

export const StopIcon = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)

export const StarIcon = ({ size = 22, on }: P & { on: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"
      fill={on ? '#FFC93C' : '#E6EBF3'}
      stroke={on ? '#D9A21A' : '#C9D1DF'}
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
  </svg>
)

export const Logo = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
    <rect x="4" y="36" width="16" height="16" rx="4" fill="#157347" />
    <rect x="20" y="22" width="16" height="30" rx="4" fill="#2F5BEA" />
    <rect x="36" y="6" width="16" height="46" rx="4" fill="#9C2C8C" />
  </svg>
)

/** Trappi, the mascot */
export const Mascot = ({ size = 92 }: P) => (
  <svg width={size} height={size} viewBox="0 0 140 140" aria-hidden="true">
    <path d="M30 70 a40 40 0 0 1 80 0" fill="none" stroke="#1B2340" strokeWidth="8" strokeLinecap="round" />
    <circle cx="70" cy="80" r="44" fill="#FFC93C" />
    <rect x="20" y="64" width="18" height="30" rx="9" fill="#1B2340" />
    <rect x="102" y="64" width="18" height="30" rx="9" fill="#1B2340" />
    <circle cx="56" cy="76" r="6" fill="#1B2340" />
    <circle cx="84" cy="76" r="6" fill="#1B2340" />
    <path d="M56 94 q14 12 28 0" fill="none" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" />
  </svg>
)

export const HeartIcon = ({ size = 24, filled }: P & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
  </svg>
)

export const SearchIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const FlameIcon = ({ size = 22, lit = true }: P & { lit?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5c.6 3.2-1.3 5-3 6.8C7.4 11 6 12.7 6 15.3a6 6 0 0 0 12 0c0-2.4-1.2-4.2-2.3-5.4-.3 1.5-1 2.5-2.1 3 .5-3.7-.2-7.6-1.6-10.4z" fill={lit ? '#F5862E' : '#E6EBF3'} />
    <path d="M12 21.3a3.6 3.6 0 0 1-3.6-3.6c0-1.9 1.4-3 2.4-4.3.4 1.2 1.1 1.9 2 2.2.1-.9.5-1.6 1.1-2.2.9 1.1 1.7 2.4 1.7 4.3a3.6 3.6 0 0 1-3.6 3.6z" fill={lit ? '#FFC93C' : '#C9D1DF'} />
  </svg>
)

export const RepeatIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M17 2l3 3-3 3" />
    <path d="M4 11V9a4 4 0 0 1 4-4h12" />
    <path d="M7 22l-3-3 3-3" />
    <path d="M20 13v2a4 4 0 0 1-4 4H4" />
  </svg>
)

export const ChatIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <path d="M17 9h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3h-3" />
  </svg>
)

export const HomeIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
  </svg>
)
