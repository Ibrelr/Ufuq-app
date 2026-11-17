/** The bar at the top of every exercise: how far through you are. */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div className="mb-4.5 flex items-center gap-3">
      <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label} className="h-3.5 flex-1 overflow-hidden rounded-full bg-track">
        <i className="block h-full rounded-full bg-ok transition-[width] duration-300" style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span dir="ltr" className="font-[Nunito] font-extrabold text-muted">
        {label}
      </span>
    </div>
  )
}
