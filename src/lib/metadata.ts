import type { Metadata } from 'next'

type BuildMetadataProps = {
  title: string
  description: string
  path?: string
  image?: string
}

const siteUrl = 'https://vindexlegal.com.ar'

export function buildMetadata({
  title,
  description,
  path = '',
  image = '/og-image.jpg',
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
      type: 'website',
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