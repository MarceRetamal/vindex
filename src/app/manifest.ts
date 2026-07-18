import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VINDEX LEGAL',
    short_name: 'VINDEX LEGAL',
    description: 'Estrategia jurídica para conflictos complejos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070A',
    theme_color: '#05070A',
    lang: 'es-AR',
  }
}