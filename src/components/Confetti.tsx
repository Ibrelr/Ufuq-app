import { useEffect, useRef } from 'react'

const COLORS = ['#2F5BEA', '#FFC93C', '#157347', '#9C2C8C', '#0E7C86', '#E5484D']

/** A short burst of confetti. Does nothing for people who prefer reduced motion. */
export function Confetti({ run = true }: { run?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!run || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()
    const W = () => canvas.width
    const pieces = Array.from({ length: 140 }, () => ({
      x: W() / 2 + (Math.random() - 0.5) * W() * 0.3,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 16 * dpr,
      vy: (-Math.random() * 14 - 6) * dpr,
      size: (6 + Math.random() * 6) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
    let frame = 0
    let raf = 0
    const tick = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pieces) {
        p.vy += 0.35 * dpr
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, 1 - frame / 160)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }
      if (frame < 160) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [run])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full" />
}
