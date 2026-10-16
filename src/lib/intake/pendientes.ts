// Respaldo de consultas: si el correo al estudio falla, la consulta se guarda
// en Cloudflare KV (binding CONSULTAS_PENDIENTES) y una tarea programada la
// reintenta cada 10 minutos (ver worker.ts y /api/intake/reintentar).
//
// Privacidad: solo se guarda lo que no se pudo entregar, se borra apenas el
// correo sale y, en cualquier caso, KV la elimina sola a los 30 días.

import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { IntakePayload } from '@/lib/intake/correo'

const PREFIJO = 'pendiente:'
const RETENCION_SEGUNDOS = 30 * 24 * 60 * 60
/** Tope por ejecución, para no exceder el tiempo de la tarea programada. */
const MAXIMO_POR_RONDA = 20

export type ConsultaPendiente = {
  payload: IntakePayload
  requestID: string
  /** Fecha ISO en que llegó la consulta. */
  recibida: string
  intentos: number
  ultimoError: string
}

function almacen(): KvNamespaceBasico {
  const kv = getCloudflareContext().env.CONSULTAS_PENDIENTES
  if (!kv) throw new Error('Falta el binding CONSULTAS_PENDIENTES en wrangler.jsonc')
  return kv
}

function describirError(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 300)
}

/** Guarda una consulta para reintentar su envío. Lanza error si no se pudo guardar. */
export async function guardarPendiente(payload: IntakePayload, requestID: string, error: unknown, ahora = new Date()) {
  const consulta: ConsultaPendiente = {
    payload,
    requestID,
    recibida: ahora.toISOString(),
    intentos: 1,
    ultimoError: describirError(error),
  }
  const expiration = Math.floor(ahora.getTime() / 1000) + RETENCION_SEGUNDOS
  await almacen().put(`${PREFIJO}${consulta.recibida}:${requestID}`, JSON.stringify(consulta), { expiration })
}

/**
 * Reintenta las consultas guardadas con `enviar`. Si sale bien, la borra; si
 * falla, suma un intento y conserva la fecha de vencimiento original.
 */
export async function reintentarPendientes(enviar: (consulta: ConsultaPendiente) => Promise<void>) {
  const kv = almacen()
  const { keys } = await kv.list({ prefix: PREFIJO, limit: MAXIMO_POR_RONDA })
  const resultado = { enviadas: 0, fallidas: 0 }

  for (const { name, expiration } of keys) {
    const consulta = await kv.get<ConsultaPendiente>(name, 'json')
    if (!consulta) continue
    try {
      await enviar(consulta)
      await kv.delete(name)
      resultado.enviadas += 1
    } catch (error) {
      resultado.fallidas += 1
      const actualizada: ConsultaPendiente = {
        ...consulta,
        intentos: consulta.intentos + 1,
        ultimoError: describirError(error),
      }
      await kv.put(name, JSON.stringify(actualizada), expiration ? { expiration } : undefined)
      console.error(`Consulta ${consulta.requestID}: reintento ${actualizada.intentos} fallido.`, error)
    }
  }

  return resultado
}
