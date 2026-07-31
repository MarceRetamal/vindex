export type Article = {
  slug: string
  title: string
  description: string
  excerpt: string
  pillarLabel: string
  datePublished: string
  dateModified: string
  readingMinutes: number
}

// Para publicar un artículo nuevo:
// 1. Agregar su entrada acá (la fecha en formato AAAA-MM-DD).
// 2. Crear la carpeta src/app/(site)/blog/<slug>/page.tsx copiando un artículo existente.
// El índice del blog y el sitemap se actualizan solos a partir de esta lista.
export const articles: Article[] = [
  {
    slug: 'citacion-penal-provincia-buenos-aires-que-hacer',
    title: 'Citación penal en la Provincia de Buenos Aires: qué hacer en las primeras 48 horas',
    description:
      'Qué significa una citación de la fiscalía (IPP), la diferencia entre testigo e imputado, qué no hacer bajo ningún concepto y cómo designar defensor en la Provincia de Buenos Aires.',
    excerpt:
      'Recibir una cédula de una fiscalía desordena a cualquiera. Esta guía explica qué significa, qué derechos tiene y cuáles son los errores de las primeras horas que después cuestan caro.',
    pillarLabel: 'Penal',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 7,
  },
  {
    slug: 'cuanto-cuesta-tarda-sucesion-provincia-buenos-aires',
    title: 'Cuánto cuesta y cuánto tarda una sucesión en la Provincia de Buenos Aires',
    description:
      'Todos los costos reales de una sucesión en PBA: tasa de justicia, honorarios, aportes, impuesto a la herencia y gastos de inscripción. Etapas del trámite y plazos realistas.',
    excerpt:
      'La pregunta que todo heredero hace primero y que casi ningún estudio responde por escrito. Acá está el desglose completo de costos y tiempos, sin promesas irreales.',
    pillarLabel: 'Sucesiones',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 8,
  },
  {
    slug: 'despido-sin-causa-como-se-calcula-indemnizacion',
    title: 'Despido sin causa: cómo se calcula la indemnización (guía actualizada)',
    description:
      'Rubros que integran la indemnización por despido sin causa tras la reforma laboral: antigüedad, preaviso, integración, SAC y vacaciones. Qué cambió y qué sigue vigente.',
    excerpt:
      'La reforma laboral de 2024 eliminó varias multas, pero la indemnización por antigüedad sigue plenamente vigente. Cómo se calcula cada rubro y qué pasos dar antes de reclamar.',
    pillarLabel: 'Laboral',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 7,
  },
]

export function getArticle(slug: string): Article {
  const article = articles.find((a) => a.slug === slug)
  if (!article) throw new Error(`Artículo no registrado en articles.ts: ${slug}`)
  return article
}
