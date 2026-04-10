import { FadeIn } from '@/components/motion/FadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'

type PageIntroProps = {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function PageIntro({
  eyebrow,
  title,
  description,
  className = '',
}: PageIntroProps) {
  return (
    <FadeIn>
      <div className={`grid gap-6 md:grid-cols-[1fr_1fr] md:gap-12 md:items-start ${className}`}>
        <div className="space-y-4">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance">
            {title}
          </h1>
        </div>

        {description ? (
          <div className="md:pt-14">
            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-base md:text-lg">
              {description}
            </p>
          </div>
        ) : null}
      </div>
    </FadeIn>
  )
}