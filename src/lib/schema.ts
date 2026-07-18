// 🏛️ DATOS ESTRUCTURADOS (Schema.org) — le dicen a Google, en un formato que
// entiende de forma nativa, qué es VINDEX, dónde está y a qué se dedica.
// Ver: https://developers.google.com/search/docs/appearance/structured-data

export const legalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'VINDEX LEGAL',
  alternateName: 'VINDEX | Estrategia Jurídica',
  url: 'https://vindexlegal.com.ar',
  description:
    'Estudio jurídico en La Plata, Buenos Aires, especializado en estrategia jurídica para conflictos complejos: derecho de familia, laboral, penal, daños y perjuicios, administrativo y ambiental.',
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
  founder: {
    '@type': 'Person',
    name: 'Dr. Marcelo F. Retamal',
    jobTitle: 'Abogado',
  },
  knowsAbout: [
    'Derecho de Familia',
    'Derecho Laboral',
    'Derecho Penal',
    'Daños y Perjuicios',
    'Derecho Administrativo',
    'Derecho Ambiental',
  ],
}