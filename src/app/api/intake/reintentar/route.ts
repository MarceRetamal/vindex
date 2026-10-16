import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getTransporter, sendInstitutionalEmail } from '@/lib/intake/correo'
import { reintentarPendientes } from '@/lib/intake/pendientes'

export const runtime = 'nodejs'

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
})

// Reenvía al estudio las consultas que quedaron pendientes. La llama solo la
// tarea programada del Worker (worker.ts) con un pedido interno: los pedidos
// que llegan desde internet siempre traen `cf` (datos de Cloudflare sobre el
// visitante) y se rechazan como si la ruta no existiera.
export async function POST() {
  if (getCloudflareContext().cf) {
    return new NextResponse(null, { status: 404 })
  }

  const resultado = await reintentarPendientes((consulta) =>
    sendInstitutionalEmail(getTransporter(), consulta.payload, {
      recibidaEl: formatoFecha.format(new Date(consulta.recibida)),
    })
  )

  if (resultado.enviadas || resultado.fallidas) console.log('Reintento de consultas pendientes:', resultado)
  return NextResponse.json(resultado)
}
