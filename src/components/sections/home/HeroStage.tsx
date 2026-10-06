'use client'

import { useEffect, useRef } from 'react'

const chips = [
  { label: 'Análisis técnico', cls: 'left-[-4%] top-[14%]', d: '1.1s', fd: '0s' },
  { label: 'Diseño estratégico', cls: 'right-[-6%] top-[40%]', d: '1.3s', fd: '-2s' },
  { label: 'Intervención procesal', cls: 'left-[2%] bottom-[10%]', d: '1.5s', fd: '-4s' },
]

/** Escena 3D del hero: una V de vidrio líquido que se inclina con el puntero. */
export function HeroStage() {
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tiltRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = () => {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      el.style.setProperty('--rx', `${(-cy * 7).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(cx * 9).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(cx * 40).toFixed(1)}px`)
      el.style.setProperty('--gy', `${(cy * 30).toFixed(1)}px`)
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    // pausa fuera de pantalla
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf)
      if (en.isIntersecting) raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <div
      ref={tiltRef}
      className="relative mx-auto aspect-[4/5] w-full max-w-[440px] [perspective:1200px] md:max-w-none"
      style={{ ['--rx' as string]: '0deg', ['--ry' as string]: '0deg', ['--gx' as string]: '0px', ['--gy' as string]: '0px' }}
      aria-hidden="true"
    >
      {/* Orbe cálido detrás del vidrio: lo que se refracta */}
      <div
        className="absolute left-1/2 top-[38%] h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 35%, rgba(229,193,88,0.85), rgba(212,175,55,0.35) 38%, rgba(212,175,55,0) 68%)',
          transform: 'translate3d(var(--gx), var(--gy), 0)',
          filter: 'blur(6px)',
        }}
      />
      <div
        className="absolute left-[18%] top-[58%] h-[34%] w-[34%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(150,170,230,0.7), rgba(150,170,230,0) 68%)',
          transform: 'translate3d(calc(var(--gx) * -1.4), calc(var(--gy) * -1), 0)',
        }}
      />

      <div
        className="anim-glass-in absolute inset-0 [transform-style:preserve-3d]"
        style={{ ['--d' as string]: '0.5s', transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
      >
        {/* La V: vidrio recortado */}
        <div
          className="glass glass-strong absolute inset-x-[6%] inset-y-[4%] !rounded-none !border-0"
          style={{
            clipPath: 'polygon(0% 0%, 24% 0%, 50% 70%, 76% 0%, 100% 0%, 60% 100%, 40% 100%)',
            ['--glass-blur' as string]: '26px',
            boxShadow: 'none',
          }}
        >
          <span
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            style={{ animation: 'sheen 5.5s var(--ease-liquid) 2s infinite' }}
          />
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-[6%] inset-y-[4%] h-[92%] w-[88%]">
          <defs>
            <linearGradient id="vedge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".95" />
              <stop offset=".45" stopColor="#C7CCD3" stopOpacity=".35" />
              <stop offset="1" stopColor="#E5C158" stopOpacity=".8" />
            </linearGradient>
          </defs>
          <polygon
            points="0,0 24,0 50,70 76,0 100,0 60,100 40,100"
            fill="none"
            stroke="url(#vedge)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {chips.map((c) => (
          <div key={c.label} className={`anim-glass-in absolute ${c.cls}`} style={{ ['--d' as string]: c.d, transform: 'translateZ(60px)' }}>
            <div className="float-y" style={{ ['--fd' as string]: c.fd }}>
              <span data-glass className="glass glass-chip text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-bright)] shadow-[0_0_10px_var(--accent)]" />
                {c.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
