import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontBody, fontHeading } from '@/lib/fonts'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://vindex.ar'),
  title: {
    default: 'VINDEX',
    template: '%s | VINDEX',
  },
  description: 'Estrategia jurídica para conflictos complejos.',
  openGraph: {
    title: 'VINDEX',
    description: 'Estrategia jurídica para conflictos complejos.',
    url: 'https://vindex.ar',
    siteName: 'VINDEX',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VINDEX',
    description: 'Estrategia jurídica para conflictos complejos.',
  },
}

export const viewport: Viewport = {
  themeColor: '#07090C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${fontBody.variable} ${fontHeading.variable}`}>
      
          <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}