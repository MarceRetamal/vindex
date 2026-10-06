'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigation } from '@/data/navigation'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <div
          data-glass
          className={cn(
            'glass mx-auto flex h-[62px] max-w-[1200px] items-center rounded-full px-3 pl-5 md:h-[66px] md:pl-7',
            'transition-[max-width,background] duration-700 [transition-timing-function:var(--ease-liquid)]',
            scrolled ? 'md:max-w-[1040px] glass-strong' : ''
          )}
        >
          <Link href="/" className="group relative z-50 shrink-0 py-2" aria-label="VINDEX LEGAL, inicio">
            <span className="font-heading text-sm font-extrabold uppercase tracking-[0.35em] text-white transition-colors group-hover:text-[var(--accent-bright)] sm:text-base md:text-lg">
              VINDEX
              <span className="ml-1.5 align-middle text-[0.55em] font-semibold tracking-[0.25em] text-[var(--vindex-silver)]">
                LEGAL
              </span>
            </span>
          </Link>

          <nav className="ml-10 hidden items-center gap-1 md:flex" aria-label="Principal">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-300',
                    isActive
                      ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto hidden md:block">
            <Button href={siteConfig.cta.href} className="!py-2.5 !px-5">
              {siteConfig.cta.label}
            </Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((p) => !p)}
            className="glass relative z-50 ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:hidden"
          >
            <span className={`absolute h-[2px] w-5 rounded bg-white transition-all duration-500 ${isOpen ? 'rotate-45' : '-translate-y-[5px]'}`} />
            <span className={`absolute h-[2px] w-5 rounded bg-white transition-all duration-500 ${isOpen ? '-rotate-45' : 'translate-y-[5px]'}`} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={isOpen} pathname={pathname} onClose={() => setIsOpen(false)} />
    </>
  )
}
