'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigation } from '@/data/navigation'
import { siteConfig } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { MobileMenu } from '@/components/layout/MobileMenu'

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'touch-none')
    } else {
      document.body.classList.remove('overflow-hidden', 'touch-none')
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'touch-none')
    }
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/80 backdrop-blur-xl">
        <Container className="flex h-[72px] items-center">
          <Link href="/" className="group relative z-50 shrink-0 py-2">
            <span className="text-base font-extrabold tracking-[0.35em] text-white uppercase transition-colors group-hover:text-[var(--accent)] sm:text-lg md:text-xl font-heading">
              VINDEX
              <span className="ml-1.5 text-[0.55em] font-semibold tracking-[0.25em] text-[var(--accent)] align-middle">
                LEGAL
              </span>
            </span>
          </Link>

          <nav className="ml-14 hidden items-center gap-9 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative whitespace-nowrap py-1 text-[15px] leading-none font-medium transition-colors hover:text-white ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute -bottom-2 left-0 h-px bg-[var(--accent)] transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-6 md:flex">
            <div className="h-6 w-px bg-[var(--border-strong)]" />
            <Button href={siteConfig.cta.href}>{siteConfig.cta.label}</Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative z-50 ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border-strong)] transition-colors active:bg-white/[0.04] md:hidden"
          >
            <span
              className={`absolute h-[2px] w-5 bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45' : '-translate-y-[6px]'
              }`}
            />
            <span
              className={`absolute h-[2px] w-5 bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45' : 'translate-y-[6px]'
              }`}
            />
          </button>
        </Container>
      </header>

      <MobileMenu isOpen={isOpen} pathname={pathname} onClose={() => setIsOpen(false)} />
    </>
  )
}