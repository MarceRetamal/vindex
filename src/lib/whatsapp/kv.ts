import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { ConversationState } from './types'

// Subconjunto mínimo de la interfaz KVNamespace de Cloudflare Workers.
// Se declara acá en lugar de depender de @cloudflare/workers-types para
// no agregar esa dependencia solo por un par de métodos.
type KVLike = {
  get(key: string, type: 'json'): Promise<unknown>
  get(key: string, type: 'text'): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

const CONVERSATION_TTL_SECONDS = 60 * 60 * 24 * 120 // 120 días de memoria por contacto
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
  await kv.put(conversationKey(state.phone), JSON.stringify(state), {
    expirationTtl: CONVERSATION_TTL_SECONDS,
  })
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
