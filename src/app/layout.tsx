import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { fontBody, fontHeading } from '@/lib/fonts'

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
        
        {/* HubSpot Embed Code */}
        <Script
          id="hs-script-loader"
          src="//js-na1.hs-scripts.com/51328372.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
