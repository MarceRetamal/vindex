import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://vindex.ar',
      lastModified: new Date(),
    },
    {
      url: 'https://vindex.ar/sistema',
      lastModified: new Date(),
    },
    {
      url: 'https://vindex.ar/areas',
      lastModified: new Date(),
    },
    {
      url: 'https://vindex.ar/criterio',
      lastModified: new Date(),
    },
    {
      url: 'https://vindex.ar/evaluacion',
      lastModified: new Date(),
    },
    {
      url: 'https://vindex.ar/contacto',
      lastModified: new Date(),
    },
    {
      url: 'https://vindex.ar/politica-de-privacidad',
      lastModified: new Date(),
    },
  ]
}
