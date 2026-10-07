// Envío de eventos a Google Analytics 4 (gtag ya está cargado en
// src/components/analytics/GoogleAnalytics.tsx). Si gtag no existe todavía
// (bloqueador de anuncios, carga lenta), no hace nada y no rompe la página.

type Gtag = (...args: unknown[]) => void

export function track(evento: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  gtag?.('event', evento, params)
}
