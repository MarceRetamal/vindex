import { FadeIn } from '@/components/motion/FadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

export function ClientProfile() {
  return (
    <Section variant="soft">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-16">
        <FadeIn>
          <div className="space-y-3 md:space-y-4">
            <Eyebrow>Perfil de cliente</Eyebrow>

            <h2 className="max-w-lg text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
              VINDEX trabaja con clientes que entienden el valor de una estrategia
              bien construida.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="rounded-[18px] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 md:p-10 shadow-2xl">
            <p className="text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8">
              Empresarios, emprendedores, pymes y estructuras patrimoniales que
              enfrentan conflictos donde el margen de error es bajo y la
              improvisación tiene costo.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-4">
              <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <p className="text-sm font-semibold text-white">
                  Conflicto con impacto real
                </p>
                <p className="mt-2 text-[15px] leading-6 text-[var(--text-secondary)] md:text-sm">
                  No se trata de consultas ligeras, sino de escenarios con riesgo,
                  presión o exposición.
                </p>
              </div>

              <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <p className="text-sm font-semibold text-white">
                  Búsqueda de dirección
                </p>
                <p className="mt-2 text-[15px] leading-6 text-[var(--text-secondary)] md:text-sm">
                  El cliente valora criterio, estructura y una intervención
                  jurídicamente seria.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}