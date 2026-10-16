import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontBody, fontHeading, fontItalic } from '@/lib/fonts'
import { legalServiceSchema } from '@/lib/schema'
import { SITE_URL } from '@/data/site'
import { JsonLd } from '@/components/seo/JsonLd'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const descripcion =
  'Estudio jurídico en La Plata: familia, accidentes de tránsito, laboral, ART y amparos de salud.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'VINDEX LEGAL',
    template: '%s | VINDEX LEGAL',
  },
  description: descripcion,
  openGraph: {
    title: 'VINDEX LEGAL',
    description: descripcion,
    url: SITE_URL,
    siteName: 'VINDEX LEGAL',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VINDEX LEGAL',
    description: descripcion,
  },
}

export const viewport: Viewport = {
  themeColor: '#07090C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" data-scroll-behavior="smooth" className={`${fontBody.variable} ${fontHeading.variable} ${fontItalic.variable}`}>
      <body className="min-h-dvh bg-[#07090C] antialiased">
      <GoogleAnalytics />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}.preloader{display:none!important}`}</style>
        </noscript>
        {/* 🏛️ Datos estructurados (Schema.org) — identidad del estudio para Google */}
        <JsonLd data={legalServiceSchema} />
        {children}

      </body>
    </html>
  )
}
