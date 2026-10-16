'use client'

import Link from 'next/link'
import { navigation } from '@/data/navigation'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { cn } from '@/lib/utils'

type MobileMenuProps = {
  isOpen: boolean
  pathname: string
  onClose: () => void
}

export function MobileMenu({ isOpen, pathname, onClose }: MobileMenuProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!isOpen}
      className={cn(
        'fixed inset-0 z-40 bg-[var(--bg-deep)]/70 backdrop-blur-2xl transition-all duration-700 [transition-timing-function:var(--ease-liquid)] md:hidden',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] flex-col px-5 pb-10 pt-[96px]">
        <nav className="flex flex-col gap-2" aria-label="Móvil">
          {navigation.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                style={{ transitionDelay: isOpen ? `${120 + i * 55}ms` : '0ms' }}
                className={cn(
                  'glass flex min-h-[56px] items-center justify-between rounded-[20px] px-5 text-lg font-semibold transition-all duration-700 [transition-timing-function:var(--ease-liquid)]',
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                  isActive ? 'glass-strong text-white' : 'text-[var(--text-secondary)]'
                )}
              >
                {item.label}
                <span aria-hidden className="text-[var(--vindex-silver-deep)]">›</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8" onClick={onClose}>
          <Button href={siteConfig.cta.href}>{siteConfig.cta.label}</Button>
        </div>

        <SocialLinks className="mt-auto justify-center pb-5" tabIndex={isOpen ? 0 : -1} />

        <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
          VINDEX LEGAL · La Plata
        </p>
      </div>
    </div>
  )
}
