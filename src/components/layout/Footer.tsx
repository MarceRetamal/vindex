import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { AREAS } from '@/data/areas'
import { contacto, whatsappUrl } from '@/data/site'
import { Overline } from '@/components/ui/Overline'

const linkClass = 'transition-colors hover:text-white'

export function Footer() {
  const wa = whatsappUrl()

  return (
    <footer data-fondo className="relative z-10 px-3 pb-3 pt-10 md:px-6 md:pb-6">
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
              Estudio jurídico en La Plata. Familia, accidentes, trabajo y salud.
            </p>

            <address className="space-y-1 text-[13px] not-italic leading-6 text-[var(--text-muted)]">
              <p>Avenida 13 N° 821, La Plata (B1900THK), Provincia de Buenos Aires.</p>
              <p>
                <TrackedLink
                  href={`tel:${contacto.telefono}`}
                  evento="contact_click"
                  params={{ method: 'phone', location: 'footer' }}
                  className={linkClass}
                >
                  {contacto.telefonoVisible}
                </TrackedLink>
              </p>
              {wa ? (
                <p>
                  <TrackedLink
                    href={wa}
                    evento="contact_click"
                    params={{ method: 'whatsapp', location: 'footer' }}
                    external
                    className={linkClass}
                  >
                    Escribinos por WhatsApp
                  </TrackedLink>
                </p>
              ) : null}
            </address>

            <SocialLinks className="pt-1" />
          </div>

          <div className="space-y-3 md:space-y-4">
            <Overline className="md:text-xs">
              Áreas
            </Overline>

            <nav className="flex flex-col gap-2.5 text-[15px] text-[var(--text-secondary)] md:gap-3 md:text-sm" aria-label="Áreas">
              {AREAS.map((a) => (
                <Link key={a.slug} href={`/${a.slug}`} className={linkClass}>
                  {a.nombre}
                </Link>
              ))}
              <Link href="/penal-urgente" className={linkClass}>
                Defensa penal urgente
              </Link>
              <Link href="/sucesiones" className={linkClass}>
                Sucesiones
              </Link>
            </nav>
          </div>

          <div className="space-y-3 md:space-y-4">
            <Overline className="md:text-xs">
              El estudio
            </Overline>

            <nav className="flex flex-col gap-2.5 text-[15px] text-[var(--text-secondary)] md:gap-3 md:text-sm" aria-label="Estudio">
              <Link href="/tips" className={linkClass}>
                Tips jurídicos
              </Link>
              <Link href="/blog" className={linkClass}>
                Blog
              </Link>
              <Link href="/direccion" className={linkClass}>
                Dirección del estudio
              </Link>
              <Link href="/criterio" className={linkClass}>
                Criterio VINDEX
              </Link>
              <Link href="/sistema" className={linkClass}>
                Sistema VINDEX
              </Link>
              <Link href="/evaluacion" className="text-white transition-colors hover:text-[var(--accent)]">
                Contar mi caso
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-strong)] pt-5 md:mt-10 md:pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] leading-6 text-[var(--text-muted)] md:text-xs">
              VINDEX LEGAL — estudio jurídico en La Plata.
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
