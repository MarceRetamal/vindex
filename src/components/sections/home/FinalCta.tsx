import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

export function FinalCta() {
  return (
    <Section className="pt-8 md:pt-16">
      <FadeIn>
        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-1)] p-6 md:rounded-[24px] md:p-12">
          <div className="max-w-3xl space-y-4 md:space-y-5">
            <Eyebrow>Evaluación jurídica</Eyebrow>

            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
              Solicite una evaluación jurídica preliminar
            </h2>

            <p className="max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8">
              Una lectura temprana, técnicamente correcta y estratégicamente
              orientada puede redefinir por completo el escenario del conflicto.
            </p>

            <div className="pt-1 md:pt-2">
              <Button href="/evaluacion">Iniciar evaluación jurídica</Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}