import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp'
import { GlassPointer } from '@/components/motion/GlassPointer'
import { Preloader } from '@/components/motion/Preloader'
import { SkipLink } from '@/components/layout/SkipLink'

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip text-[var(--text-primary)]">
      <SkipLink />
      <Preloader />
      <GlassPointer />

      {/* Aurora: la luz que el vidrio refracta. Solo transform en animación. */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-orb o1" />
        <div className="aurora-orb o2" />
        <div className="aurora-orb o3" />
        <div className="aurora-orb o4" />
        <div className="aurora-grain" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header />
        {/* data-fondo: se vuelve inerte mientras el menú móvil está abierto (ver Header). */}
        <main id="contenido" tabIndex={-1} data-fondo className="flex-grow focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>

      <FloatingWhatsApp />
    </div>
  )
}
