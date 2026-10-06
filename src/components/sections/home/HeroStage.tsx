'use client'

import { useEffect, useRef } from 'react'

const chips = [
  { label: 'Análisis técnico', cls: 'left-[-2%] top-[4%]', d: '1.6s', fd: '0s' },
  { label: 'Diseño estratégico', cls: 'right-[-4%] top-[50%]', d: '1.8s', fd: '-2s' },
  { label: 'Intervención procesal', cls: 'left-[2%] bottom-[0%]', d: '2s', fd: '-4s' },
]


/* Geometría del logo VINDEX (trazado sobre el arte original, viewBox 60 50 380 300). */
const VB = { x: 60, y: 50, w: 380, h: 300 }
const BLADE_L = [[80, 72], [178, 72], [295, 325], [196, 325]]
const BLADE_R = [[322, 72], [420, 72], [308, 308], [262, 205]]
const BEVEL_L = [[89, 79], [168, 79], [287, 318], [203, 318]]
const BEVEL_R = [[329, 79], [412, 79], [305, 292], [270, 208]]
const pts = (poly: number[][]) => poly.map(([x, y]) => `${x},${y}`).join(' ')
const ring = (poly: number[][]) => 'M' + poly.map(([x, y]) => `${x},${y}`).join('L') + 'Z'
const clip = (poly: number[][]) =>
  `polygon(${poly.map(([x, y]) => `${(((x - VB.x) / VB.w) * 100).toFixed(2)}% ${(((y - VB.y) / VB.h) * 100).toFixed(2)}%`).join(', ')})`

const TICKS = Array.from({ length: 96 }, (_, i) => i)

/**
 * Sello VINDEX: el logo de dos hojas en vidrio líquido con haz de luz y gema dorada,
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
      {/* Esfera de brasa detrás del vidrio: gradiente difuso que el disco esmerila */}
      <div
        className="absolute inset-[7%] rounded-full"
        style={{ transform: 'translate3d(calc(var(--gx) * -0.9), calc(var(--gy) * -0.9), 0)' }}
      >
        <div className="orb-core absolute inset-0 rounded-full" />
        <div className="orb-swirl absolute inset-0 rounded-full" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 60px rgba(255,170,100,0.35), 0 0 120px rgba(255,106,43,0.25)' }} />
      </div>

      <div
        className="anim-glass-in absolute inset-0 [transform-style:preserve-3d]"
        style={{ ['--d' as string]: '0.4s', transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
      >
        {/* Disco de vidrio */}
        <div className="glass glass-strong absolute inset-[17%] rounded-full" style={{ ['--glass-blur' as string]: '30px', background: 'var(--glass-noise), linear-gradient(150deg, rgba(8,4,3,0.78) 0%, rgba(40,14,6,0.52) 55%, rgba(90,30,10,0.38) 100%)' }}>
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
              <stop offset=".5" stopColor="#E0D5CE" stopOpacity=".12" />
              <stop offset="1" stopColor="#FF9A5C" stopOpacity=".7" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="190" fill="none" stroke="url(#ring-edge)" strokeWidth="1" pathLength={1} className="emb-draw" style={{ ['--d' as string]: '0.8s' }} />
          <g className="emb-spin" style={{ ['--spin' as string]: '240s' }}>
            {TICKS.map((i) => (
              <line
                key={i}
                x1="200" y1="14" x2="200" y2={i % 8 === 0 ? 26 : 19}
                stroke={i % 8 === 0 ? '#FF9A5C' : '#fff'}
                strokeOpacity={i % 8 === 0 ? 0.9 : 0.28}
                strokeWidth={i % 8 === 0 ? 1.6 : 1}
                transform={`rotate(${(i * 360) / 96} 200 200)`}
              />
            ))}
          </g>
          <g className="emb-spin emb-spin-rev" style={{ ['--spin' as string]: '120s' }}>
            <text fill="#E0D5CE" fillOpacity=".75" fontSize="11.5" fontWeight="700" letterSpacing="5.4">
              <textPath href="#ring-text">
                VINDEX LEGAL · ESTRATEGIA JURÍDICA · LA PLATA · PROVINCIA DE BUENOS AIRES ·
              </textPath>
            </text>
          </g>
          <circle cx="200" cy="200" r="146" fill="none" stroke="#FF9A5C" strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 7" />
        </svg>

        {/* El emblema: logo VINDEX en vidrio con halo y resplandor interior */}
        <div className="absolute inset-0 grid place-items-center" style={{ transform: 'translateZ(70px)' }}>
          <div className="relative w-[54%]" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
            {/* halo exterior (outer glow) que respira */}
            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="glow-breathe pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <filter id="haloWide" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22" /></filter>
                <filter id="haloTight" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
              </defs>
              <g>
                <g filter="url(#haloWide)" opacity=".85">
                  <polygon points={pts(BLADE_L)} fill="#FF5A1F" />
                  <polygon points={pts(BLADE_R)} fill="#FF8A3D" />
                </g>
                <g filter="url(#haloTight)" opacity=".9">
                  <polygon points={pts(BLADE_L)} fill="none" stroke="#FF9A5C" strokeWidth="5" strokeLinejoin="round" />
                  <polygon points={pts(BLADE_R)} fill="none" stroke="#FF9A5C" strokeWidth="5" strokeLinejoin="round" />
                </g>
              </g>
            </svg>

            {[BLADE_L, BLADE_R].map((b, i) => (
              <div
                key={i}
                className="glass glass-strong absolute inset-0 !rounded-none !border-0 emb-fill"
                style={{ clipPath: clip(b), boxShadow: 'none', ['--glass-blur' as string]: '14px', ['--d' as string]: i ? '1.4s' : '1.2s' }}
              >
                <span
                  className="absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  style={{ animation: 'sheen 6s var(--ease-liquid) infinite', animationDelay: i ? '3.1s' : '2.8s' }}
                />
              </div>
            ))}

            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                {/* resplandor interior (inner glow): crema arriba-izquierda, brasa abajo-derecha */}
                <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFF6EC" stopOpacity=".95" />
                  <stop offset=".5" stopColor="#FFC08A" stopOpacity=".62" />
                  <stop offset="1" stopColor="#FF6A2B" stopOpacity=".5" />
                </linearGradient>
                <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFF4E6" stopOpacity=".95" />
                  <stop offset=".55" stopColor="#FFB070" stopOpacity=".5" />
                  <stop offset="1" stopColor="#FF6A2B" stopOpacity=".9" />
                </linearGradient>
                <linearGradient id="beamTail" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FF6A2B" stopOpacity=".95" />
                  <stop offset="1" stopColor="#FFE2C4" stopOpacity=".95" />
                </linearGradient>
                <radialGradient id="gemGlow">
                  <stop offset="0" stopColor="#FFD2A8" stopOpacity=".95" />
                  <stop offset="1" stopColor="#FF6A2B" stopOpacity="0" />
                </radialGradient>
                <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2" /></filter>
                <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9" /></filter>
                <clipPath id="clipL"><polygon points={pts(BLADE_L)} /></clipPath>
                <clipPath id="clipR"><polygon points={pts(BLADE_R)} /></clipPath>
              </defs>

              {[
                { poly: BLADE_L, bev: BEVEL_L, d: 1.3, ph: 0, clipId: 'clipL' },
                { poly: BLADE_R, bev: BEVEL_R, d: 1.5, ph: 0.5, clipId: 'clipR' },
              ].map(({ poly, bev, d, ph, clipId }, i) => (
                <g key={i}>
                  <polygon className="emb-fill" style={{ ['--d' as string]: `${d}s` }} points={pts(poly)} fill="url(#face)" />
                  {/* inner glow: borde luminoso hacia adentro */}
                  <g clipPath={`url(#${clipId})`} className="emb-fill glow-breathe" style={{ ['--d' as string]: `${d + 0.2}s` }}>
                    <polygon points={pts(poly)} fill="none" stroke="#FFD9B5" strokeWidth="16" strokeOpacity=".55" strokeLinejoin="round" filter="url(#innerGlow)" />
                  </g>
                  <path className="emb-fill" style={{ ['--d' as string]: `${d + 0.2}s` }} d={ring(poly) + ring(bev)} fillRule="evenodd" fill="url(#rim)" opacity=".55" />
                  <polygon points={pts(bev)} fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth=".8" strokeLinejoin="round" className="emb-fill" style={{ ['--d' as string]: `${d + 0.3}s` }} />
                  {/* contorno que se dibuja al cargar */}
                  <polygon className="emb-draw" style={{ ['--d' as string]: `${0.5 + i * 0.2}s` }} points={pts(poly)} pathLength={1} fill="none" stroke="#FFEFDC" strokeOpacity=".98" strokeWidth="1.8" strokeLinejoin="round" />
                  {/* haz de luz en bucle sobre el contorno */}
                  <g className="emb-fill" style={{ ['--d' as string]: '2.4s' }}>
                    <polygon className="beam" style={{ ['--b0' as string]: -ph }} points={pts(poly)} pathLength={1} fill="none" stroke="#FF6A2B" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.08 0.92" filter="url(#beamGlow)" opacity=".95" />
                    <polygon className="beam" style={{ ['--b0' as string]: -ph }} points={pts(poly)} pathLength={1} fill="none" stroke="url(#beamTail)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.22 0.78" strokeOpacity=".8" />
                    <polygon className="beam" style={{ ['--b0' as string]: -(ph + 0.17) }} points={pts(poly)} pathLength={1} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.05 0.95" />
                  </g>
                </g>
              ))}

              {/* gema de brasa en la muesca de la hoja derecha */}
              <g className="emb-fill" style={{ ['--d' as string]: '2.2s' }}>
                <circle cx="262" cy="205" r="22" fill="url(#gemGlow)" className="emb-gem" />
                <polygon points="262,195 269,205 262,215 255,205" fill="#FFD2A8" stroke="#fff" strokeOpacity=".9" strokeWidth=".8" />
                <polygon points="262,195 269,205 262,205" fill="#fff" opacity=".6" />
              </g>
            </svg>
          </div>
        </div>

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
