import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { Overline } from '@/components/ui/Overline'

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
      <div data-glass className="glass glass-strong mt-14 overflow-hidden rounded-[28px] p-6 md:mt-16 md:rounded-[36px] md:p-12">
        <div className="max-w-3xl space-y-4 md:space-y-5">
          <Overline className="md:text-xs">
            {eyebrow}
          </Overline>

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