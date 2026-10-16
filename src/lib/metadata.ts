import type { Metadata } from 'next'
import { SITE_URL as siteUrl } from '@/data/site'

type BuildMetadataProps = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export function buildMetadata({
  title,
  description,
  path = '',
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataProps): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'VINDEX LEGAL',
      locale: 'es_AR',
      type,
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}