import { redesSociales } from '@/data/site'
import { cn } from '@/lib/utils'

// Íconos de marca dibujados a mano (lucide-react ya no incluye logos de marcas).
const ICONOS: Record<(typeof redesSociales)[number]['red'], React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.7 1-3 2.5-3s2.5 1 2.5 3V17" />
    </>
  ),
  google: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
}

export function SocialLinks({ className, tabIndex }: { className?: string; tabIndex?: number }) {
  return (
    <ul className={cn('flex items-center gap-2.5', className)} aria-label="Redes del estudio">
      {redesSociales.map((r) => (
        <li key={r.red}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tabIndex}
            aria-label={`VINDEX LEGAL en ${r.nombre}`}
            title={r.nombre}
            data-glass
            className="glass grid h-10 w-10 place-items-center rounded-full text-[var(--vindex-silver)] transition-colors hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {ICONOS[r.red]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
