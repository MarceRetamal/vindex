import tipsGenerados from '@/content/tips.generated.json'

// Igual que blog.ts: el contenido (src/content/tips/*.md) lo procesa
// scripts/build-content.mjs en cada build y acá solo se importa el resultado.

export type Tip = {
  slug: string
  titulo: string
  descripcion: string
  categoria: string
  fecha: string
  actualizado: string
  minutos: number
  resumen: string[]
}

export type TipCompleto = Tip & { html: string }

const TODOS_LOS_TIPS = tipsGenerados as unknown as TipCompleto[]

export function obtenerTips(): Tip[] {
  return TODOS_LOS_TIPS.map(({ html: _html, ...resto }) => resto)
}

export function obtenerTip(slug: string): TipCompleto | undefined {
  return TODOS_LOS_TIPS.find((t) => t.slug === slug)
}

// Categorías en el orden en que se muestran. `categoria` en cada tip .md
// tiene que coincidir exacto con `nombre`.
export const CATEGORIAS_TIPS = [
  { nombre: 'Amparos', ancla: 'amparos', areaHref: '/amparos-salud-discapacidad' },
  { nombre: 'Familia', ancla: 'familia', areaHref: '/derecho-de-familia' },
  { nombre: 'Tránsito', ancla: 'transito', areaHref: '/accidentes-de-transito' },
  { nombre: 'Laboral', ancla: 'laboral', areaHref: '/derecho-laboral' },
  { nombre: 'ART', ancla: 'art', areaHref: '/accidentes-laborales-art' },
] as const
