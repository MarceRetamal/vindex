'use client'

import { useEffect, useRef } from 'react'

const chips = [
  { label: 'Análisis técnico', cls: 'left-[-2%] top-[4%]', d: '1.6s', fd: '0s' },
  { label: 'Diseño estratégico', cls: 'right-[-4%] top-[50%]', d: '1.8s', fd: '-2s' },
  { label: 'Intervención procesal', cls: 'left-[2%] bottom-[0%]', d: '2s', fd: '-4s' },
]

const TICKS = Array.from({ length: 96 }, (_, i) => i)

/**
 * Sello VINDEX: una V de dos hojas biseladas con eje y gema dorada,
 * dentro de un disco de vidrio con anillos grabados que giran lento.
 * Cada capa tiene distinta profundidad para el parallax con el puntero.
 */
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
      el.style.setProperty('--rx', `${(-cy * 8).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(cx * 10).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(cx * 34).toFixed(1)}px`)
      el.style.setProperty('--gy', `${(cy * 26).toFixed(1)}px`)
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
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
      className="relative mx-auto aspect-square w-full max-w-[480px] [perspective:1400px] md:max-w-[560px]"
      style={{ ['--rx' as string]: '0deg', ['--ry' as string]: '0deg', ['--gx' as string]: '0px', ['--gy' as string]: '0px' }}
      aria-hidden="true"
    >
      {/* Luz cálida y fría detrás del disco */}
      <div
        className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 45% 40%, rgba(229,193,88,0.55), rgba(212,175,55,0.16) 42%, transparent 70%)',
          transform: 'translate3d(calc(var(--gx) * -0.8), calc(var(--gy) * -0.8), 0)',
        }}
      />
      <div
        className="absolute bottom-[4%] right-[6%] h-[38%] w-[38%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(140,160,230,0.55), transparent 68%)',
          transform: 'translate3d(calc(var(--gx) * 1.2), calc(var(--gy) * 1), 0)',
        }}
      />

      <div
        className="anim-glass-in absolute inset-0 [transform-style:preserve-3d]"
        style={{ ['--d' as string]: '0.4s', transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
      >
        {/* Disco de vidrio */}
        <div className="glass glass-strong absolute inset-[7%] rounded-full" style={{ ['--glass-blur' as string]: '28px' }}>
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span
              className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              style={{ animation: 'sheen 7s var(--ease-liquid) 2.6s infinite' }}
            />
          </span>
        </div>

        {/* Anillos grabados */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ transform: 'translateZ(24px)' }}>
          <defs>
            <path id="ring-text" d="M200,200 m-166,0 a166,166 0 1,1 332,0 a166,166 0 1,1 -332,0" />
            <linearGradient id="ring-edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".7" />
              <stop offset=".5" stopColor="#C7CCD3" stopOpacity=".12" />
              <stop offset="1" stopColor="#E5C158" stopOpacity=".7" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="190" fill="none" stroke="url(#ring-edge)" strokeWidth="1" pathLength={1} className="emb-draw" style={{ ['--d' as string]: '0.8s' }} />
          <g className="emb-spin" style={{ ['--spin' as string]: '240s' }}>
            {TICKS.map((i) => (
              <line
                key={i}
                x1="200" y1="14" x2="200" y2={i % 8 === 0 ? 26 : 19}
                stroke={i % 8 === 0 ? '#E5C158' : '#fff'}
                strokeOpacity={i % 8 === 0 ? 0.9 : 0.28}
                strokeWidth={i % 8 === 0 ? 1.6 : 1}
                transform={`rotate(${(i * 360) / 96} 200 200)`}
              />
            ))}
          </g>
          <g className="emb-spin emb-spin-rev" style={{ ['--spin' as string]: '120s' }}>
            <text fill="#C7CCD3" fillOpacity=".75" fontSize="11.5" fontWeight="700" letterSpacing="5.4">
              <textPath href="#ring-text">
                VINDEX LEGAL · ESTRATEGIA JURÍDICA · LA PLATA · PROVINCIA DE BUENOS AIRES ·
              </textPath>
            </text>
          </g>
          <circle cx="200" cy="200" r="146" fill="none" stroke="#E5C158" strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 7" />
        </svg>

        {/* El emblema: V de hojas biseladas + eje + gema */}
        <svg viewBox="0 0 200 200" className="absolute inset-[19%] h-[62%] w-[62%] overflow-visible" style={{ transform: 'translateZ(70px)' }}>
          <defs>
            <linearGradient id="bladeL" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".55" stopColor="#dfe3ea" />
              <stop offset="1" stopColor="#9aa2b1" />
            </linearGradient>
            <linearGradient id="bladeR" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#aeb5c2" />
              <stop offset=".6" stopColor="#5c6475" />
              <stop offset="1" stopColor="#2b3140" />
            </linearGradient>
            <linearGradient id="bevel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="axis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E5C158" stopOpacity="0" />
              <stop offset=".35" stopColor="#E5C158" />
              <stop offset="1" stopColor="#E5C158" stopOpacity=".15" />
            </linearGradient>
            <radialGradient id="gemGlow">
              <stop offset="0" stopColor="#F6DD8A" stopOpacity=".95" />
              <stop offset="1" stopColor="#E5C158" stopOpacity="0" />
            </radialGradient>
            <filter id="drop" x="-30%" y="-30%" width="160%" height="170%">
              <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity=".55" />
            </filter>
          </defs>

          <g filter="url(#drop)">
            {/* hoja izquierda (luz) */}
            <polygon className="emb-fill" style={{ ['--d' as string]: '1.2s' }} points="34,50 64,32 100,108 100,172" fill="url(#bladeL)" />
            {/* hoja derecha (sombra) */}
            <polygon className="emb-fill" style={{ ['--d' as string]: '1.35s' }} points="166,50 136,32 100,108 100,172" fill="url(#bladeR)" />
            {/* bisel interior: reflejo en el filo de cada hoja */}
            <polygon className="emb-fill" style={{ ['--d' as string]: '1.6s' }} points="64,32 100,108 100,121 58,36" fill="url(#bevel)" opacity=".8" />
            <polygon className="emb-fill" style={{ ['--d' as string]: '1.7s' }} points="136,32 100,108 100,121 142,36" fill="#fff" opacity=".18" />
          </g>

          {/* contorno que se dibuja al cargar */}
          <polygon
            className="emb-draw"
            style={{ ['--d' as string]: '0.6s' }}
            points="34,50 64,32 100,108 136,32 166,50 100,172"
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeOpacity=".95"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* junta dorada: el filo donde las dos hojas se encuentran */}
          <line className="emb-draw" style={{ ['--d' as string]: '1.4s' }} x1="100" y1="108" x2="100" y2="172" pathLength={1} stroke="#E5C158" strokeWidth="1.4" />

          {/* eje de precisión */}
          <line className="emb-draw" style={{ ['--d' as string]: '1.8s' }} x1="100" y1="22" x2="100" y2="96" pathLength={1} stroke="url(#axis)" strokeWidth="1.4" />
          <g className="emb-fill" style={{ ['--d' as string]: '2.2s' }}>
            <circle cx="100" cy="22" r="14" fill="url(#gemGlow)" className="emb-gem" />
            <polygon points="100,12 107,22 100,32 93,22" fill="#F6DD8A" stroke="#fff" strokeOpacity=".9" strokeWidth=".8" />
            <polygon points="100,12 107,22 100,22" fill="#fff" opacity=".6" />
          </g>
        </svg>

        {/* Etiquetas flotantes */}
        {chips.map((c) => (
          <div key={c.label} className={`anim-glass-in absolute ${c.cls}`} style={{ ['--d' as string]: c.d, transform: 'translateZ(110px)' }}>
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
