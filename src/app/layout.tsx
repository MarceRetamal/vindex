import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { fontBody, fontHeading } from '@/lib/fonts'
import { legalServiceSchema } from '@/lib/schema'
export const metadata: Metadata = {
  // 1. CORREGIDO: Actualizamos la base del dominio para indexación real de Google
  metadataBase: new URL('https://vindexlegal.com.ar'), 
  title: {
    default: 'VINDEX LEGAL',
    template: '%s | VINDEX LEGAL',
  },
  description: 'Estrategia jurídica para conflictos complejos.',
  openGraph: {
    title: 'VINDEX LEGAL',
    description: 'Estrategia jurídica para conflictos complejos.',
    url: 'https://vindexlegal.com.ar', // 2. CORREGIDO: URL canónica oficial para redes sociales
    siteName: 'VINDEX LEGAL',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VINDEX LEGAL',
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
      {/* 3. OPTIMIZADO: Aseguramos una altura mínima estructural y suavizado de fuentes */}
      {/* 3. OPTIMIZADO: Aseguramos una altura mínima estructural y suavizado de fuentes */}
      <body className="min-h-screen bg-[#07090C] antialiased">
        {/* 🏛️ Datos estructurados (Schema.org) — identidad del estudio para Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
        />
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