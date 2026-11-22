// Límite de intentos del formulario de consulta. Cada consulta válida dispara
// correos y tres WhatsApp, así que se acota por visitante (IP) y por teléfono
// de destino (para que nadie pueda usar el sitio para escribirle a un tercero).
//
// Si el binding no existe (next dev, preview local) no se limita nada.

import { getCloudflareContext } from '@opennextjs/cloudflare'

const PREFIJO_TELEFONO = 'limite-tel:'
const VENTANA_SEGUNDOS = 24 * 60 * 60
/** Consultas aceptadas por teléfono en 24 horas. */
const MAXIMO_POR_TELEFONO = 3

function entorno() {
  try {
    return getCloudflareContext().env
  } catch {
    return undefined
  }
}

/** true si la IP superó el límite por minuto (binding INTAKE_LIMITER). */
export async function ipExcedida(ip: string | null): Promise<boolean> {
  const limiter = entorno()?.INTAKE_LIMITER
  if (!limiter) return false
  const { success } = await limiter.limit({ key: ip ?? 'sin-ip' })
  return !success
}

/**
 * Cuenta una consulta para ese teléfono. Devuelve true si ya alcanzó el tope
 * (en ese caso no suma). KV es eventualmente consistente: es un freno al abuso,
 * no un contador exacto.
 */
export async function telefonoExcedido(telefono: string, ahora = Date.now()): Promise<boolean> {
  const kv = entorno()?.CONSULTAS_PENDIENTES
  if (!kv) return false
  const clave = `${PREFIJO_TELEFONO}${telefono}`
  const actual = await kv.get<{ n: number; exp: number }>(clave, 'json')
  if (actual && actual.n >= MAXIMO_POR_TELEFONO) return true
  const exp = actual?.exp ?? Math.floor(ahora / 1000) + VENTANA_SEGUNDOS
  await kv.put(clave, JSON.stringify({ n: (actual?.n ?? 0) + 1, exp }), { expiration: exp })
  return false
}
