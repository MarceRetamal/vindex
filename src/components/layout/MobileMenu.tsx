'use client'

import Link from 'next/link'
import { navigation } from '@/data/navigation'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/Button'

type MobileMenuProps = {
  isOpen: boolean
  pathname: string
  onClose: () => void
}

export function MobileMenu({
  isOpen,
  pathname,
  onClose,
}: MobileMenuProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className={`fixed inset-0 top-[72px] z-40 bg-[var(--bg-main)]/95 backdrop-blur-2xl transition-all duration-500 will-change-transform md:hidden ${
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-4 opacity-0'
      }`}
    >
      <div className="mx-auto flex h-[calc(100vh-72px)] max-w-[1200px] flex-col px-5 pt-8 pb-10">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`relative flex min-h-[48px] items-center rounded-lg px-4 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.04] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] active:bg-white/[0.02]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[var(--accent)]" />
                )}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-4">
          <Button href={siteConfig.cta.href}>
            {siteConfig.cta.label}
          </Button>
        </div>

        {/* 🏛️ DETALLE DE ÉLITE: Cierre protocolar al fondo del viewport móvil */}
        <div className="mt-auto px-4 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600">
            VINDEX — Protocolo de Admisión Activo
          </p>
        </div>
      </div>
    </div>
  )
}