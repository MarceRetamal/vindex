// 🏛️ DATOS ESTRUCTURADOS (Schema.org) — le dicen a Google, en un formato que
// entiende de forma nativa, qué es VINDEX, dónde está y a qué se dedica.
// Ver: https://developers.google.com/search/docs/appearance/structured-data
//
// Todo el JSON-LD del sitio sale de este archivo, para que el estudio y su
// abogado se describan siempre igual en cada página.

import { SITE_URL, contacto, redesSociales } from '@/data/site'

const ID_ESTUDIO = `${SITE_URL}/#estudio`
const URL_GOOGLE_MAPS = redesSociales.find((r) => r.red === 'google')?.href

const abogado = {
  '@type': 'Person',
  name: 'Marcelo Fabián Retamal',
  jobTitle: 'Abogado',
  url: `${SITE_URL}/direccion`,
} as const

export const legalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  '@id': ID_ESTUDIO,
  name: 'VINDEX LEGAL',
  alternateName: 'VINDEX | Estrategia Jurídica',
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    'Estudio jurídico en La Plata, Buenos Aires: derecho de familia, accidentes de tránsito, derecho laboral, accidentes de trabajo y ART, amparos de salud y discapacidad, defensa penal y sucesiones.',
  telephone: contacto.telefono,
  email: contacto.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida 13 N° 821',
    addressLocality: 'La Plata',
    addressRegion: 'Buenos Aires',
    postalCode: 'B1900THK',
    addressCountry: 'AR',
  },
  areaServed: [
    { '@type': 'City', name: 'La Plata' },
    { '@type': 'AdministrativeArea', name: 'Provincia de Buenos Aires' },
  ],
  attorney: {
    ...abogado,
    alumniOf: 'Universidad Nacional de La Plata',
  },
  knowsAbout: [
    'Derecho de Familia',
    'Accidentes de Tránsito',
    'Derecho Laboral',
    'Riesgos del Trabajo (ART)',
    'Amparos de Salud y Discapacidad',
    'Derecho Penal',
    'Sucesiones',
  ],
  // Perfiles oficiales del estudio fuera de este sitio. Le confirman a Google
  // y a los modelos de IA que "VINDEX LEGAL — Marcelo F. Retamal" es una sola
  // entidad (y no otra con nombre parecido). Se cargan en src/data/site.ts.
  sameAs: redesSociales.map((r) => r.href) as string[],
  hasMap: URL_GOOGLE_MAPS,
}

/** Referencia corta al estudio, para usar dentro de otros esquemas. */
const estudioRef = { '@type': 'LegalService', '@id': ID_ESTUDIO, name: 'VINDEX LEGAL' } as const

/** Artículo (nota del blog o tip) firmado por el abogado y publicado por el estudio. */
export function articleSchema({
  titulo,
  descripcion,
  seccion,
  fecha,
  actualizado,
  url,
}: {
  titulo: string
  descripcion: string
  seccion?: string
  fecha: string
  actualizado: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titulo,
    description: descripcion,
    ...(seccion ? { articleSection: seccion } : {}),
    datePublished: fecha,
    dateModified: actualizado,
    inLanguage: 'es-AR',
    image: `${SITE_URL}/og-image.jpg`,
    mainEntityOfPage: url,
    author: abogado,
    publisher: { ...estudioRef, url: SITE_URL },
  }
}

/** Servicio de una página de área, prestado por el estudio. */
export function serviceSchema({
  nombre,
  tipo,
  descripcion,
  url,
}: {
  nombre: string
  tipo: string
  descripcion: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: nombre,
    description: descripcion,
    url,
    serviceType: tipo,
    areaServed: legalServiceSchema.areaServed,
    provider: estudioRef,
  }
}

/** Preguntas frecuentes. `id` es opcional (las notas del blog lo llevan). */
export function faqSchema(preguntas: { pregunta: string; respuesta: string }[], opciones: { id?: string } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(opciones.id ? { '@id': opciones.id, inLanguage: 'es-AR' } : {}),
    mainEntity: preguntas.map(({ pregunta, respuesta }) => ({
      '@type': 'Question',
      name: pregunta,
      acceptedAnswer: { '@type': 'Answer', text: respuesta },
    })),
  }
}
