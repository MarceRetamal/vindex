import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="relative z-10 px-3 pb-3 pt-10 md:px-6 md:pb-6">
      <div data-glass className="glass mx-auto max-w-[1200px] rounded-[32px] md:rounded-[40px]">
      <Container className="py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:gap-10">
          <div className="space-y-3 md:space-y-4">
            <div className="text-sm font-bold tracking-[0.22em] text-white">
              VINDEX
              <span className="ml-1 text-[0.6em] font-semibold tracking-[0.18em] text-[var(--vindex-silver)]">
                LEGAL
              </span>
            </div>

            <p className="max-w-md text-[15px] leading-7 text-[var(--text-secondary)] md:text-base">
              Análisis, estrategia e intervención jurídica para conflictos
              complejos.
            </p>

            <address className="space-y-1 text-[13px] not-italic leading-6 text-[var(--text-muted)]">
              <p>Avenida 13 N° 821, La Plata (B1900THK), Provincia de Buenos Aires.</p>
              <p>
                <a href="tel:+5491141743745" className="transition-colors hover:text-white">
                  +54 9 11 4174-3745
                </a>
              </p>
            </address>
          </div>

          <div className="space-y-3 md:space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)] md:text-xs">
              Navegación
            </p>

            <nav className="flex flex-col gap-2.5 text-[15px] text-[var(--text-secondary)] md:gap-3 md:text-sm">
              <Link href="/sistema" className="transition-colors hover:text-white">
                Sistema VINDEX
              </Link>
              <Link href="/areas" className="transition-colors hover:text-white">
                Áreas de intervención
              </Link>
              <Link href="/direccion" className="transition-colors hover:text-white">
                Dirección del Estudio
              </Link>
              <Link href="/penal-urgente" className="transition-colors hover:text-white">
                Defensa penal urgente
              </Link>
              <Link href="/sucesiones" className="transition-colors hover:text-white">
                Sucesiones
              </Link>
              <Link href="/criterio" className="transition-colors hover:text-white">
                Criterio VINDEX
              </Link>
              <Link href="/evaluacion" className="transition-colors hover:text-white">
                Evaluación jurídica
              </Link>
            </nav>
          </div>

          <div className="space-y-3 md:space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)] md:text-xs">
              Evaluación
            </p>

            <div className="space-y-2.5 text-[15px] leading-7 text-[var(--text-secondary)] md:space-y-3 md:text-sm">
              <p>
                Primer contacto orientado a ordenar el caso, su urgencia y su
                encuadre inicial.
              </p>

              <Link
                href="/evaluacion"
                className="inline-flex text-white transition-colors hover:text-[var(--accent)]"
              >
                Solicitar evaluación
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-strong)] pt-5 md:mt-10 md:pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] leading-6 text-[var(--text-muted)] md:text-xs">
              VINDEX LEGAL — estrategia jurídica para conflictos complejos.
            </p>
            <Link
              href="/politica-de-privacidad"
              className="text-[11px] leading-6 text-[var(--text-muted)] underline decoration-dashed underline-offset-4 transition-colors hover:text-white md:text-xs"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </Container>
      </div>
    </footer>
  )
}