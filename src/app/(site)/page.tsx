import { AreasPreview } from '@/components/sections/home/AreasPreview'
import { ClientProfile } from '@/components/sections/home/ClientProfile'
import { Differential } from '@/components/sections/home/Differential'
import { FinalCta } from '@/components/sections/home/FinalCta'
import { Hero } from '@/components/sections/home/Hero'
import { Positioning } from '@/components/sections/home/Positioning'
// 🔌 EL CABLE DE UNIÓN: Conectamos el Radar al núcleo de la Home
import { RadarScanner } from '@/components/sections/home/RadarScanner'
import { System } from '@/components/sections/home/System'
import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Inicio',
  description: 'Estrategia jurídica para conflictos complejos.',
})

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* 📡 INTERSECCIÓN TÁCTICA: Módulo VINDEX RADAR */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-[#07090d] to-black border-y border-[var(--border)]/20 relative z-10">
        <RadarScanner />
      </section>

      <Positioning />
      <System />
      <Differential />
      <AreasPreview />
      <ClientProfile />
      <FinalCta />
    </>
  )
}