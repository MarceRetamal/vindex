import { MetadataRoute } from 'next'

const baseUrl = 'https://vindexlegal.com.ar'

// 📅 Fechas reales de la última modificación de contenido de cada página.
// A diferencia de `new Date()` (que siempre marca "hoy" en cada build y le
// resta credibilidad a esta señal ante Google), estas fechas solo hay que
// actualizarlas a mano cuando el CONTENIDO de esa página cambie de verdad.
const lastModified = {
  home: new Date('2026-07-18T12:54:25-03:00'),
  areas: new Date('2026-07-18T11:44:58-03:00'),
  evaluacion: new Date('2026-07-18T11:44:58-03:00'),
  criterio: new Date('2026-07-18T11:44:58-03:00'),
  sistema: new Date('2026-07-18T11:44:58-03:00'),
  politicaDePrivacidad: new Date('2026-07-18T12:42:13-03:00'),
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: lastModified.home,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: lastModified.areas,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/evaluacion`,
      lastModified: lastModified.evaluacion,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/criterio`,
      lastModified: lastModified.criterio,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sistema`,
      lastModified: lastModified.sistema,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politica-de-privacidad`,
      lastModified: lastModified.politicaDePrivacidad,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}