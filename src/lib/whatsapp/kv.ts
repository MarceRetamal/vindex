import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { ConversationState } from './types'

// Subconjunto mínimo de la interfaz KVNamespace de Cloudflare Workers.
// Se declara acá en lugar de depender de @cloudflare/workers-types para
// no agregar esa dependencia solo por un par de métodos.
type KVLike = {
  get(key: string, type: 'json'): Promise<unknown>
  get(key: string, type: 'text'): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number; expiration?: number }): Promise<void>
}

// Retención: 30 días corridos desde el primer mensaje, ni más ni menos. Es un
// tope absoluto (no se renueva con cada mensaje): al vencer, KV borra todo y
// una nueva consulta empieza de cero. El resumen que recibe el estudio por
// correo es el registro que se conserva.
export const RETENTION_SECONDS = 60 * 60 * 24 * 30
const RATE_LIMIT_PER_HOUR = 20
const DEDUPE_TTL_SECONDS = 60 * 10

async function getKv(): Promise<KVLike> {
  const { env } = await getCloudflareContext({ async: true })
  const kv = (env as Record<string, unknown>).WHATSAPP_KV as KVLike | undefined
  if (!kv) {
    throw new Error(
      'Falta el binding KV "WHATSAPP_KV". Configuralo en wrangler.jsonc (ver README) antes de usar el agente de WhatsApp.'
    )
  }
  return kv
}

function conversationKey(phone: string): string {
  return `wa:conversation:${phone}`
}

function dedupeKey(messageId: string): string {
  return `wa:msgid:${messageId}`
}

export async function loadConversation(phone: string): Promise<ConversationState | null> {
  const kv = await getKv()
  const data = await kv.get(conversationKey(phone), 'json')
  return (data as ConversationState) ?? null
}

export async function saveConversation(state: ConversationState): Promise<void> {
  const kv = await getKv()
  // Vencimiento absoluto = alta + 30 días. KV exige al menos 60 s hacia adelante.
  const wanted = Math.floor(new Date(state.createdAt).getTime() / 1000) + RETENTION_SECONDS
  const expiration = Math.max(wanted, Math.floor(Date.now() / 1000) + 60)
  await kv.put(conversationKey(state.phone), JSON.stringify(state), { expiration })
}

// Evita procesar dos veces el mismo mensaje entrante cuando Meta reintenta
// la entrega del webhook (comportamiento normal de su infraestructura).
export async function claimMessageOnce(messageId: string): Promise<boolean> {
  const kv = await getKv()
  const existing = await kv.get(dedupeKey(messageId), 'text')
  if (existing) return false
  await kv.put(dedupeKey(messageId), '1', { expirationTtl: DEDUPE_TTL_SECONDS })
  return true
}

// Tope de mensajes por contacto y hora: protege el gasto de la API de IA ante
// spam o bucles. Devuelve cuántos mensajes lleva en esta hora.
export async function bumpRateLimit(phone: string): Promise<{ allowed: boolean; count: number; limit: number }> {
  const kv = await getKv()
  const bucket = Math.floor(Date.now() / 3_600_000)
  const key = `wa:rl:${phone}:${bucket}`
  const current = Number((await kv.get(key, 'text')) ?? '0')
  const count = current + 1
  await kv.put(key, String(count), { expirationTtl: 3700 })
  return { allowed: count <= RATE_LIMIT_PER_HOUR, count, limit: RATE_LIMIT_PER_HOUR }
}
