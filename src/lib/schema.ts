// 🏛️ DATOS ESTRUCTURADOS (Schema.org) — le dicen a Google, en un formato que
// entiende de forma nativa, qué es VINDEX, dónde está y a qué se dedica.
// Ver: https://developers.google.com/search/docs/appearance/structured-data

export const legalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  '@id': 'https://vindexlegal.com.ar/#estudio',
  name: 'VINDEX LEGAL',
  alternateName: 'VINDEX | Estrategia Jurídica',
  url: 'https://vindexlegal.com.ar',
  image: 'https://vindexlegal.com.ar/og-image.jpg',
  description:
    'Estudio jurídico en La Plata, Buenos Aires: derecho de familia, accidentes de tránsito, derecho laboral, accidentes de trabajo y ART, amparos de salud y discapacidad, defensa penal y sucesiones.',
  telephone: '+5491141743745',
  email: 'info@vindexlegal.com.ar',
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
    '@type': 'Person',
    name: 'Marcelo Fabián Retamal',
    jobTitle: 'Abogado',
    url: 'https://vindexlegal.com.ar/direccion',
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
}
