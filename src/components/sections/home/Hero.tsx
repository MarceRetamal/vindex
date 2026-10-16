import { HeroStage } from '@/components/sections/home/HeroStage'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

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
              Estudio jurídico · La Plata
            </p>

            <h1 className="max-w-[15ch] text-[2.4rem] font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.6rem]">
              <span className="mask-line"><span style={{ ['--d' as string]: '0.25s' }}>Abogados en</span>{' '}</span>
              <span className="mask-line"><span style={{ ['--d' as string]: '0.35s' }}>La Plata para</span>{' '}</span>
              <span className="mask-line">
                <span className="bg-gradient-to-r from-white via-[var(--vindex-silver)] to-[var(--vindex-silver-deep)] bg-clip-text text-transparent" style={{ ['--d' as string]: '0.45s' }}>
                  tu problema legal
                </span>
              </span>
            </h1>

            <p className="anim-rise max-w-xl text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8" style={{ ['--d' as string]: '0.7s' }}>
              Familia, accidentes, trabajo y salud. Te explicamos tu caso en lenguaje claro y actuamos en toda la
              Provincia de Buenos Aires.
            </p>

            <div className="anim-rise flex flex-col gap-3 pt-1 sm:flex-row sm:gap-4" style={{ ['--d' as string]: '0.85s' }}>
              <Button href="/evaluacion">Contar mi caso</Button>
              <Button href="/tips" variant="secondary">Ver tips jurídicos</Button>
            </div>

            <p className="anim-rise text-[13px] leading-6 text-[var(--text-muted)]" style={{ ['--d' as string]: '1s' }}>
              Dr. Marcelo F. Retamal · Abogado (UNLP) ·{' '}
              <span className="whitespace-nowrap">Matrícula CALP T° LXVI F° 263</span>
            </p>
          </div>

          <HeroStage />
        </div>
      </Container>
    </section>
  )
}
