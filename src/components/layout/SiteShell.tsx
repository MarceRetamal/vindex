import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[var(--bg)]">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[var(--accent)]/10 blur-3xl opacity-50" />
        <div className="absolute right-[-12%] top-[18%] h-[360px] w-[360px] rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-[320px] w-[320px] rounded-full bg-[var(--accent)]/5 blur-3xl opacity-50" />
      </div>

      <div className="relative z-10">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}