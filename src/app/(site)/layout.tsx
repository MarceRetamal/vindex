import { SiteShell } from '@/components/layout/SiteShell'

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SiteShell>{children}</SiteShell>
}