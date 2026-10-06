import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VINDEX LEGAL',
    short_name: 'VINDEX LEGAL',
    description: 'Estrategia jurídica para conflictos complejos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07090C',
    theme_color: '#07090C',
    lang: 'es-AR',
  }
}