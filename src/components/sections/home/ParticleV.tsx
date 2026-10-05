'use client'

import { useEffect, useRef } from 'react'

/**
 * Geometría real del isotipo VINDEX LEGAL (src/app/icon.svg), no una V
 * inventada para este efecto. Vértices del path
 * "M154 128L256 336L358 128H404L278 384H234L108 128H154Z" en su
 * viewBox original de 512x512.
 */
const ISOTYPE_POLYGON: [number, number][] = [
  [154, 128],
  [256, 336],
  [358, 128],
  [404, 128],
  [278, 384],
  [234, 384],
  [108, 128],
]
const ISOTYPE_BOUNDS = { minX: 108, maxX: 404, minY: 128, maxY: 384 }

function isInsidePolygon(x: number, y: number, polygon: [number, number][]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

/** Genera N puntos distribuidos uniformemente dentro del polígono de la V, por rejection sampling. */
function samplePolygonPoints(count: number): [number, number][] {
  const points: [number, number][] = []
  const { minX, maxX, minY, maxY } = ISOTYPE_BOUNDS
  let guard = 0
  while (points.length < count && guard < count * 50) {
    guard++
    const x = minX + Math.random() * (maxX - minX)
    const y = minY + Math.random() * (maxY - minY)
    if (isInsidePolygon(x, y, ISOTYPE_POLYGON)) points.push([x, y])
  }
  return points
}

type Particle = {
  x: number
  y: number
  tx: number
  ty: number
  vx: number
  vy: number
  seed: number
}

const DESKTOP_COUNT = 2500
const MOBILE_COUNT = 800
const MOBILE_BREAKPOINT = 768
const MAX_DPR = 1.5
const CURSOR_RADIUS = 90
const CURSOR_FORCE = 900
const SPRING = 0.045
const FRICTION = 0.86

export function ParticleV() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particleColor =
      getComputedStyle(document.documentElement).getPropertyValue('--vindex-silver').trim() ||
      '#C7CCD3'

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

    const targets = samplePolygonPoints(count)
    const { minX, maxX, minY, maxY } = ISOTYPE_BOUNDS
    const shapeW = maxX - minX
    const shapeH = maxY - minY

    let width = wrapper.clientWidth
    let height = wrapper.clientHeight
    let scale = 1
    let offsetX = 0
    let offsetY = 0

    const particles: Particle[] = targets.map(() => {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.max(width, height, 200)
      return {
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        tx: 0,
        ty: 0,
        vx: 0,
        vy: 0,
        seed: Math.random() * Math.PI * 2,
      }
    })

    function layout() {
      if (!canvas || !wrapper) return
      width = wrapper.clientWidth
      height = wrapper.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

      scale = Math.min(width / shapeW, height / shapeH) * 0.72
      offsetX = width / 2 - (shapeW / 2 + minX) * scale
      offsetY = height / 2 - (shapeH / 2 + minY) * scale

      particles.forEach((particle, i) => {
        const [px, py] = targets[i]
        particle.tx = px * scale + offsetX
        particle.ty = py * scale + offsetY
      })
    }

    layout()

    let mouseX = -9999
    let mouseY = -9999
    let pointerActive = false

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      pointerActive = true
    }
    function handlePointerLeave() {
      pointerActive = false
      mouseX = -9999
      mouseY = -9999
    }

    let raf = 0
    let running = false
    let t = 0

    function tick() {
      if (!ctx) return
      t += 1
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = particleColor

      for (const particle of particles) {
        const breatheX = Math.sin(t * 0.006 + particle.seed) * 1.4
        const breatheY = Math.cos(t * 0.005 + particle.seed) * 1.4
        const targetX = particle.tx + breatheX
        const targetY = particle.ty + breatheY

        particle.vx += (targetX - particle.x) * SPRING
        particle.vy += (targetY - particle.y) * SPRING

        if (pointerActive) {
          const dx = particle.x - mouseX
          const dy = particle.y - mouseY
          const dist = Math.hypot(dx, dy) || 1
          if (dist < CURSOR_RADIUS) {
            const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE
            particle.vx += (dx / dist) * force * 0.001
            particle.vy += (dy / dist) * force * 0.001
          }
        }

        particle.vx *= FRICTION
        particle.vy *= FRICTION
        particle.x += particle.vx
        particle.y += particle.vy

        ctx.globalAlpha = 0.55
        ctx.fillRect(particle.x, particle.y, 1.6, 1.6)
      }

      if (running) raf = requestAnimationFrame(tick)
    }

    function start() {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && document.visibilityState === 'visible') {
          start()
        } else {
          stop()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(wrapper)

    function handleVisibility() {
      if (document.visibilityState === 'visible') start()
      else stop()
    }

    window.addEventListener('resize', layout)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative aspect-square w-full max-w-[520px] mx-auto md:aspect-[4/5] md:max-w-none">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  )
}
