import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vindexlegal.com.ar'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Protegemos las rutas internas de la API para que Google no intente indexar código backend
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}