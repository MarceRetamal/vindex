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
    slug: 'estafa-virtual-banco-devolucion-fallos-la-plata',
    title: 'Le vaciaron la cuenta en una estafa virtual: los fallos de La Plata que obligan a los bancos a devolver el dinero',
    description:
      'La justicia de La Plata condenó a bancos a devolver lo robado en estafas virtuales, con daño punitivo incluido. Cuándo responde el banco, cuándo no, y los pasos que hay que dar en las primeras horas.',
    excerpt:
      'Dos sentencias recientes de juzgados platenses ordenaron a bancos devolver hasta el último peso de cuentas vaciadas por estafadores. Pero no todos los casos terminan igual. La diferencia está en los detalles.',
    pillarLabel: 'Consumidor',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 8,
  },
  {
    slug: 'pension-discapacidad-andis-suspendida-amparo',
    title: 'ANDIS le suspendió o no le otorga la pensión por discapacidad: qué está pasando en la justicia y qué puede hacer',
    description:
      'El estado real de los reclamos contra ANDIS: qué pasó con el amparo colectivo, por qué los amparos individuales siguen ganando en la justicia federal y qué documentación hay que reunir para reclamar.',
    excerpt:
      'Entre auditorías, suspensiones masivas y una ley de emergencia, miles de personas quedaron sin cobrar. El mapa judicial cambió varias veces en pocos meses. Esto es lo que está pasando de verdad, y el camino que sigue abierto.',
    pillarLabel: 'Discapacidad',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 9,
  },
  {
    slug: 'canasta-crianza-cuota-alimentaria-fallos',
    title: 'La canasta de crianza cambió las cuotas alimentarias: qué están fallando los jueces (y qué pasa con los abuelos)',
    description:
      'Los tribunales usan la canasta de crianza del INDEC como piso de la cuota alimentaria, no como techo. Fallos recientes fijaron cuotas superiores y extendieron la obligación a los abuelos. Qué significa para su caso.',
    excerpt:
      'Un número publicado todos los meses por el INDEC está reordenando los juicios de alimentos en todo el país. Y los fallos recientes dejaron dos cosas claras: es un piso, no un techo. Y la cadena de obligados no termina en los padres.',
    pillarLabel: 'Familia',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 8,
  },
  {
    slug: 'no-me-dejan-ver-a-mis-hijos-impedimento-contacto',
    title: 'No me dejan ver a mis hijos: las tres vías legales cuando cortan el contacto',
    description:
      'El régimen de comunicación es un derecho del hijo, no un favor entre adultos. Qué herramientas da la ley ante el impedimento de contacto: medidas judiciales del art. 557 CCyC, la vía penal y el reclamo de daños.',
    excerpt:
      'El teléfono que no contesta, los fines de semana que se cancelan a último momento, las excusas que se acumulan. La ley tiene nombre para eso, y también tiene herramientas. Ninguna de las tres empieza por pelearse.',
    pillarLabel: 'Familia',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 8,
  },
  {
    slug: 'divorcio-sin-acuerdo-como-funciona-argentina',
    title: 'Divorcio sin acuerdo: por qué "no te doy el divorcio" ya no significa nada',
    description:
      'Desde 2015 el divorcio en Argentina es incausado: nadie puede oponerse ni frenarlo. Qué exige el Código Civil y Comercial, cómo se dividen los bienes y el plazo de 6 meses que casi nadie conoce.',
    excerpt:
      'La frase "no te voy a dar el divorcio" sigue funcionando como amenaza — pero jurídicamente está vacía desde hace más de una década. Cómo funciona de verdad, qué se divide y qué no, y el derecho que caduca a los 6 meses.',
    pillarLabel: 'Familia',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 8,
  },
  {
    slug: 'cuota-alimentaria-cuanto-corresponde-hasta-cuando',
    title: 'Cuota alimentaria: cuánto corresponde, hasta cuándo se paga y qué hacer si no pagan',
    description:
      'Los alimentos de los hijos no terminan a los 18: rigen hasta los 21 y hasta los 25 si estudian (arts. 658 y 663 CCyC). Cómo se calcula la cuota, desde cuándo se debe y las herramientas reales contra el incumplimiento.',
    excerpt:
      'Tres preguntas concentran casi todas las consultas: cuánto, hasta cuándo y qué pasa si no paga. Las tres tienen respuesta legal precisa — y varias desmienten lo que se repite en las charlas de WhatsApp.',
    pillarLabel: 'Familia',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 9,
  },
  {
    slug: 'fallecio-sin-testamento-quien-hereda',
    title: 'Falleció sin testamento: quién hereda (y quién se queda sin nada) según la ley',
    description:
      'Sin testamento, el Código Civil y Comercial define quién hereda: hijos, cónyuge, padres, hermanos. La regla de los gananciales que confunde a todos y por qué el conviviente no hereda aunque hayan pasado 20 años juntos.',
    excerpt:
      'Cuando no hay testamento, la ley ya escribió uno. A veces coincide con lo que la familia espera; otras veces deja afuera justamente a quien compartió la vida con el fallecido. Los escenarios, uno por uno.',
    pillarLabel: 'Sucesiones',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    readingMinutes: 9,
  },
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
