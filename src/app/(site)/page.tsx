import { AreasPreview } from '@/components/sections/home/AreasPreview'
import { FinalCta } from '@/components/sections/home/FinalCta'
import { FrequentSituations } from '@/components/sections/home/FrequentSituations'
import { Hero } from '@/components/sections/home/Hero'
import { TipsPreview } from '@/components/sections/home/TipsPreview'
import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'VINDEX LEGAL | Estudio Jurídico en La Plata, Buenos Aires',
    description:
      'Estudio jurídico en La Plata: familia, accidentes de tránsito, laboral, ART y amparos de salud. Consulta confidencial con respuesta en 24 hs hábiles.',
  }),
  title: {
    absolute: 'VINDEX LEGAL | Estudio Jurídico en La Plata, Buenos Aires',
  },
}

// Home: entrada rápida por situación, áreas, tips y contacto. Los bloques
// anteriores (Positioning, System, Differential, ClientProfile) se borraron
// el 16/10/2026; si hacen falta, están en el historial de git.
export default function HomePage() {
  return (
    <>
      <Hero />
      <FrequentSituations />
      <AreasPreview />
      <TipsPreview />
      <FinalCta />
    </>
  )
}
