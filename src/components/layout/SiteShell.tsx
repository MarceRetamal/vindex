import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp'

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    /* 🏛️ OPTIMIZACIÓN DE ELITE: overflow-x-hidden evita scrolls horizontales fantasmas en mobile por los blurs */
    <div className="relative min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] overflow-x-clip">

      {/* Capa de atmósfera del búnker — tonos plata: el gold se reserva para
          CTAs y momentos de conversión, no para un halo presente en cada
          página. */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[var(--bg)]">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[var(--vindex-silver)]/[0.06] blur-3xl opacity-50" />
        <div className="absolute right-[-12%] top-[18%] h-[360px] w-[360px] rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-[320px] w-[320px] rounded-full bg-[var(--vindex-silver)]/[0.03] blur-3xl opacity-50" />

        {/* Grano sutil para dar profundidad al negro, sin competir con el
            contenido — permitido explícitamente en el brief. Sin blend
            mode: `overlay` amplifica el contraste del ruido en vez de
            suavizarlo, así que a opacidad baja igual se ve como estática. */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-dvh">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>

      <FloatingWhatsApp />
    </div>
  )
}