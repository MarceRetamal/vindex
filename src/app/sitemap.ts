import { MetadataRoute } from 'next'
import { obtenerNotas } from '@/lib/blog'

const baseUrl = 'https://vindexlegal.com.ar'

export const dynamic = 'force-static'

const lastModified = {
  home: new Date('2026-07-31T12:00:00-03:00'),
  areas: new Date('2026-07-30T14:46:00-03:00'),
  evaluacion: new Date('2026-07-23T12:00:00-03:00'),
  criterio: new Date('2026-07-30T14:46:00-03:00'),
  sistema: new Date('2026-07-30T14:46:00-03:00'),
  direccion: new Date('2026-07-22T00:00:00-03:00'),
  penalUrgente: new Date('2026-07-31T12:00:00-03:00'),
  sucesiones: new Date('2026-07-31T12:00:00-03:00'),
  blog: new Date('2026-07-31T12:00:00-03:00'),
  politicaDePrivacidad: new Date('2026-07-18T12:42:13-03:00'),
}

export default function sitemap(): MetadataRoute.Sitemap {
  const notas: MetadataRoute.Sitemap = obtenerNotas().map((nota) => ({
    url: `${baseUrl}/blog/${nota.slug}`,
    lastModified: new Date(`${nota.actualizado}T12:00:00-03:00`),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: lastModified.home, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/areas`, lastModified: lastModified.areas, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/evaluacion`, lastModified: lastModified.evaluacion, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/criterio`, lastModified: lastModified.criterio, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sistema`, lastModified: lastModified.sistema, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/direccion`, lastModified: lastModified.direccion, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/penal-urgente`, lastModified: lastModified.penalUrgente, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/sucesiones`, lastModified: lastModified.sucesiones, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: lastModified.blog, changeFrequency: 'weekly', priority: 0.8 },
    ...notas,
    { url: `${baseUrl}/politica-de-privacidad`, lastModified: lastModified.politicaDePrivacidad, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
