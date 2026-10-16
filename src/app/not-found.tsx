import { SiteShell } from '@/components/layout/SiteShell'
import { Button } from '@/components/ui/Button'
import { StatusPage } from '@/components/ui/StatusPage'

// La 404 vive fuera del grupo (site), así que suma el encabezado y el pie a
// mano: quien llega a una dirección rota tiene el menú para seguir navegando.
export default function NotFound() {
  return (
    <SiteShell>
      <StatusPage
        eyebrow="Error 404"
        title="La página solicitada no existe o no está disponible."
        description="El recurso que intentaste abrir no forma parte de la estructura actual de VINDEX LEGAL o fue desplazado dentro del sistema."
        actions={
          <>
            <Button href="/">Volver al inicio</Button>
            <Button href="/evaluacion" variant="secondary">
              Contar mi caso
            </Button>
          </>
        }
      />
    </SiteShell>
  )
}
