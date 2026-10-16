import { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Protegemos las rutas internas de la API para que Google no intente indexar código backend
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}