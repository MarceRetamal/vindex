import { MetadataRoute } from 'next'
import { AREAS } from '@/data/areas'
import { obtenerNotas } from '@/lib/blog'
import { obtenerTips } from '@/lib/tips'

const baseUrl = 'https://vindexlegal.com.ar'

export const dynamic = 'force-static'

const lastModified = {
  home: new Date('2026-10-07T12:00:00-03:00'),
  areas: new Date('2026-10-07T12:00:00-03:00'),
  evaluacion: new Date('2026-10-07T12:00:00-03:00'),
  criterio: new Date('2026-10-06T12:00:00-03:00'),
  sistema: new Date('2026-10-06T12:00:00-03:00'),
  direccion: new Date('2026-10-06T12:00:00-03:00'),
  penalUrgente: new Date('2026-10-06T12:00:00-03:00'),
  sucesiones: new Date('2026-07-31T12:00:00-03:00'),
  blog: new Date('2026-10-07T12:00:00-03:00'),
  tips: new Date('2026-10-07T12:00:00-03:00'),
  areaNueva: new Date('2026-10-07T12:00:00-03:00'),
  politicaDePrivacidad: new Date('2026-07-18T12:42:13-03:00'),
}

// El listado del blog y el de tips cambian cada vez que se publica o se
// actualiza una nota o un tip: su fecha es la más reciente entre la fecha
// fija de arriba (último cambio del diseño del listado) y la de su contenido.
function masReciente(base: Date, items: MetadataRoute.Sitemap): Date {
  return items.reduce<Date>((max, item) => {
    const fecha = item.lastModified instanceof Date ? item.lastModified : new Date(item.lastModified ?? 0)
    return fecha > max ? fecha : max
  }, base)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const notas: MetadataRoute.Sitemap = obtenerNotas().map((nota) => ({
    url: `${baseUrl}/blog/${nota.slug}`,
    lastModified: new Date(`${nota.actualizado}T12:00:00-03:00`),
  }))

  const tips: MetadataRoute.Sitemap = obtenerTips().map((tip) => ({
    url: `${baseUrl}/tips/${tip.slug}`,
    lastModified: new Date(`${tip.actualizado}T12:00:00-03:00`),
  }))

  const areas: MetadataRoute.Sitemap = AREAS.map((a) => ({
    url: `${baseUrl}/${a.slug}`,
    lastModified: lastModified.areaNueva,
  }))

  return [
    { url: baseUrl, lastModified: lastModified.home },
    { url: `${baseUrl}/areas`, lastModified: lastModified.areas },
    ...areas,
    { url: `${baseUrl}/penal-urgente`, lastModified: lastModified.penalUrgente },
    { url: `${baseUrl}/sucesiones`, lastModified: lastModified.sucesiones },
    { url: `${baseUrl}/evaluacion`, lastModified: lastModified.evaluacion },
    { url: `${baseUrl}/tips`, lastModified: masReciente(lastModified.tips, tips) },
    ...tips,
    { url: `${baseUrl}/blog`, lastModified: masReciente(lastModified.blog, notas) },
    ...notas,
    { url: `${baseUrl}/direccion`, lastModified: lastModified.direccion },
    { url: `${baseUrl}/criterio`, lastModified: lastModified.criterio },
    { url: `${baseUrl}/sistema`, lastModified: lastModified.sistema },
    { url: `${baseUrl}/politica-de-privacidad`, lastModified: lastModified.politicaDePrivacidad },
  ]
}
