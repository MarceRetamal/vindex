import Link from 'next/link'
import { HeroStage } from '@/components/sections/home/HeroStage'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

const shortcuts = [
  { href: '/penal-urgente', label: 'Denuncia o causa penal' },
  { href: '/sucesiones', label: 'Sucesión' },
  { href: '/evaluacion', label: 'Otro conflicto' },
]

export function Hero() {
  return (
    <section className="relative pb-16 pt-10 sm:pt-14 md:pb-28 md:pt-20">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
          <div className="space-y-6 md:space-y-8">
            <p
              data-glass
              className="glass glass-chip anim-rise text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--vindex-silver)] md:text-xs"
              style={{ ['--d' as string]: '0.15s' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-bright)] shadow-[0_0_10px_var(--accent)]" />
              Intervención jurídica de alta precisión
            </p>

            <h1 className="max-w-[15ch] text-[2.4rem] font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.6rem]">
              <span className="mask-line"><span style={{ ['--d' as string]: '0.25s' }}>Abogados en</span></span>
              <span className="mask-line"><span style={{ ['--d' as string]: '0.35s' }}>La Plata para</span></span>
              <span className="mask-line">
                <span className="bg-gradient-to-r from-[#FFE9D2] via-[#FF9A5C] to-[#FF5A1F] bg-clip-text text-transparent" style={{ ['--d' as string]: '0.45s' }}>
                  conflictos complejos
                </span>
              </span>
            </h1>

            <p className="anim-rise max-w-xl text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8" style={{ ['--d' as string]: '0.7s' }}>
              VINDEX LEGAL estructura análisis, evaluación e intervención para escenarios
              jurídicos en La Plata y en toda la Provincia de Buenos Aires, donde la claridad
              técnica, la lectura profunda del conflicto y la superioridad estratégica
              modifican el resultado.
            </p>

            <div className="anim-rise flex flex-col gap-3 pt-1 sm:flex-row sm:gap-4" style={{ ['--d' as string]: '0.85s' }}>
              <Button href="/evaluacion">Solicitar evaluación jurídica</Button>
              <Button href="/sistema" variant="secondary">Conocer el sistema</Button>
            </div>

            <div className="anim-rise pt-2" style={{ ['--d' as string]: '1s' }}>
              <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Acceso directo según su situación
              </p>
              <div className="flex flex-wrap gap-2.5">
                {shortcuts.map((s) => (
                  <Link key={s.href} href={s.href} data-glass className="glass glass-chip">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <HeroStage />
        </div>
      </Container>
    </section>
  )
}
