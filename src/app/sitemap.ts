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
  }))

  return [
    { url: baseUrl, lastModified: lastModified.home },
    { url: `${baseUrl}/areas`, lastModified: lastModified.areas },
    { url: `${baseUrl}/evaluacion`, lastModified: lastModified.evaluacion },
    { url: `${baseUrl}/criterio`, lastModified: lastModified.criterio },
    { url: `${baseUrl}/sistema`, lastModified: lastModified.sistema },
    { url: `${baseUrl}/direccion`, lastModified: lastModified.direccion },
    { url: `${baseUrl}/penal-urgente`, lastModified: lastModified.penalUrgente },
    { url: `${baseUrl}/sucesiones`, lastModified: lastModified.sucesiones },
    { url: `${baseUrl}/blog`, lastModified: lastModified.blog },
    ...notas,
    { url: `${baseUrl}/politica-de-privacidad`, lastModified: lastModified.politicaDePrivacidad },
  ]
}
