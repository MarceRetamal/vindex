'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { StatusPage } from '@/components/ui/StatusPage'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusPage
      eyebrow="Error de ejecución"
      title="Ocurrió un problema inesperado en esta sección."
      description="La interfaz no pudo renderizar correctamente este segmento. Podés reintentar o volver al inicio."
      actions={
        <>
          <Button onClick={() => reset()} arrow={false}>
            Reintentar
          </Button>
          <Button href="/" variant="secondary">
            Volver al inicio
          </Button>
        </>
      }
    />
  )
}
