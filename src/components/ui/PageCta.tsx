import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'

type PageCtaProps = {
  eyebrow?: string
  title: string
  description: string
  buttonLabel?: string
  buttonHref?: string
}

export function PageCta({
  eyebrow = 'Evaluación jurídica',
  title,
  description,
  buttonLabel = 'Solicitar evaluación',
  buttonHref = '/evaluacion',
}: PageCtaProps) {
  return (
    <FadeIn>
      <div className="mt-14 rounded-[20px] border border-[var(--border)] bg-[var(--surface-1)] p-6 md:mt-16 md:rounded-[24px] md:p-12">
        <div className="max-w-3xl space-y-4 md:space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:text-xs">
            {eyebrow}
          </p>

          <h2 className="max-w-[15ch] text-2xl font-extrabold leading-tight md:max-w-[13ch] md:text-5xl">
            {title}
          </h2>

          <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">
            {description}
          </p>

          <div className="pt-1 md:pt-2">
            <Button href={buttonHref}>{buttonLabel}</Button>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}