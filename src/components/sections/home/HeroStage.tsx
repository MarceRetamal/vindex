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

        {/* El emblema: logo VINDEX en vidrio líquido real (refracta la luz detrás) */}
        <div className="absolute inset-0 grid place-items-center" style={{ transform: 'translateZ(70px)' }}>
          <div className="relative w-[72%]" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <filter id="shadowBlur" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="11" /></filter>
              </defs>
              <g filter="url(#shadowBlur)" opacity=".55" transform="translate(0 16)">
                <polygon points={pts(BLADE_L)} fill="#000" />
                <polygon points={pts(BLADE_R)} fill="#000" />
              </g>
            </svg>

            {[BLADE_L, BLADE_R].map((b, i) => (
              <div
                key={i}
                className="glass glass-strong absolute inset-0 !rounded-none !border-0 emb-fill"
                style={{ clipPath: clip(b), boxShadow: 'none', ['--glass-blur' as string]: '16px', ['--d' as string]: i ? '1.4s' : '1.2s' }}
              >
                <span
                  className="absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{ animation: 'sheen 6s var(--ease-liquid) 2.8s infinite', animationDelay: i ? '3.1s' : '2.8s' }}
                />
              </div>
            ))}

            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity=".62" />
                  <stop offset=".55" stopColor="#dfe6f5" stopOpacity=".22" />
                  <stop offset="1" stopColor="#E5C158" stopOpacity=".10" />
                </linearGradient>
                <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity=".95" />
                  <stop offset=".5" stopColor="#c9d2e6" stopOpacity=".35" />
                  <stop offset="1" stopColor="#E5C158" stopOpacity=".7" />
                </linearGradient>
                <linearGradient id="beamTail" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E5C158" stopOpacity=".9" />
                  <stop offset="1" stopColor="#fff" stopOpacity=".9" />
                </linearGradient>
                <radialGradient id="gemGlow">
                  <stop offset="0" stopColor="#F6DD8A" stopOpacity=".95" />
                  <stop offset="1" stopColor="#E5C158" stopOpacity="0" />
                </radialGradient>
                <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2" /></filter>
              </defs>

              {[
                { poly: BLADE_L, bev: BEVEL_L, d: 1.3, ph: 0 },
                { poly: BLADE_R, bev: BEVEL_R, d: 1.5, ph: 0.5 },
              ].map(({ poly, bev, d, ph }, i) => (
                <g key={i}>
                  {/* cuerpo y bisel tipo cromo */}
                  <polygon className="emb-fill" style={{ ['--d' as string]: `${d}s` }} points={pts(poly)} fill="url(#face)" />
                  <path className="emb-fill" style={{ ['--d' as string]: `${d + 0.2}s` }} d={ring(poly) + ring(bev)} fillRule="evenodd" fill="url(#rim)" opacity=".5" />
                  <polygon points={pts(bev)} fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth=".8" strokeLinejoin="round" className="emb-fill" style={{ ['--d' as string]: `${d + 0.3}s` }} />
                  {/* contorno que se dibuja al cargar */}
                  <polygon className="emb-draw" style={{ ['--d' as string]: `${0.5 + i * 0.2}s` }} points={pts(poly)} pathLength={1} fill="none" stroke="#fff" strokeOpacity=".95" strokeWidth="1.8" strokeLinejoin="round" />
                  {/* haz de luz que recorre el contorno en bucle */}
                  <g className="emb-fill" style={{ ['--d' as string]: '2.4s' }}>
                    <polygon className="beam" style={{ ['--b0' as string]: -ph }} points={pts(poly)} pathLength={1} fill="none" stroke="#E5C158" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.07 0.93" filter="url(#beamGlow)" opacity=".9" />
                    <polygon className="beam" style={{ ['--b0' as string]: -ph }} points={pts(poly)} pathLength={1} fill="none" stroke="url(#beamTail)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.2 0.8" strokeOpacity=".75" />
                    <polygon className="beam" style={{ ['--b0' as string]: -(ph + 0.15) }} points={pts(poly)} pathLength={1} fill="none" stroke="#fff" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.05 0.95" />
                  </g>
                </g>
              ))}

              {/* gema dorada en la muesca de la hoja derecha */}
              <g className="emb-fill" style={{ ['--d' as string]: '2.2s' }}>
                <circle cx="262" cy="205" r="22" fill="url(#gemGlow)" className="emb-gem" />
                <polygon points="262,195 269,205 262,215 255,205" fill="#F6DD8A" stroke="#fff" strokeOpacity=".9" strokeWidth=".8" />
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
