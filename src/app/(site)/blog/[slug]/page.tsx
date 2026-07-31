import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/metadata'
import { obtenerNota, obtenerNotas } from '@/lib/blog'
import { ArticleShell } from '@/components/blog/ArticleShell'

export const dynamic = 'force-static'
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return obtenerNotas().map((nota) => ({ slug: nota.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const nota = obtenerNota(slug)

  if (!nota) return buildMetadata({ title: 'Nota no encontrada', description: '', path: '/blog' })

  return buildMetadata({
    title: nota.titulo,
    description: nota.descripcion,
    path: `/blog/${nota.slug}`,
  })
}

export default async function NotaPage({ params }: Props) {
  const { slug } = await params
  const nota = obtenerNota(slug)

  if (!nota) notFound()

  return <ArticleShell nota={nota} />
}
