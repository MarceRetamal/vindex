import { AreasPreview } from '@/components/sections/home/AreasPreview'
import { ClientProfile } from '@/components/sections/home/ClientProfile'
import { Differential } from '@/components/sections/home/Differential'
import { FinalCta } from '@/components/sections/home/FinalCta'
import { Hero } from '@/components/sections/home/Hero'
import { Positioning } from '@/components/sections/home/Positioning'
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
      <Positioning />
      <System />
      <Differential />
      <AreasPreview />
      <ClientProfile />
      <FinalCta />
    </>
  )
}