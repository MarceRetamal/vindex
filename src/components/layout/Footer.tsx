import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-strong)] bg-[var(--bg-elevated)] relative z-10">
      <Container className="py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:gap-10">
          <div className="space-y-3 md:space-y-4">
            {/* ... esta columna (VINDEX LEGAL + descripción + La Plata) NO se toca ... */}
          </div>

          <div className="space-y-3 md:space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:text-xs">
              Navegación
            </p>

            {/* 👇 ACÁ VA EL BLOQUE NUEVO, reemplazando el <nav>...</nav> actual */}
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
            {/* ... esta columna (Evaluación / texto / link) NO se toca ... */}
          </div>
        </div>

        {/* ... el resto del footer (línea inferior con copyright y política de privacidad) NO se toca ... */}
      </Container>
    </footer>
  )
}