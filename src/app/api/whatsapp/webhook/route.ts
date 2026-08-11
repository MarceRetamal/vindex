import { NextResponse } from 'next/server'
import { decide } from '@/lib/whatsapp/agent'
import { markAsRead, sendListMenu, sendReplyButtons, sendText } from '@/lib/whatsapp/graph'
import { claimMessageOnce, loadConversation, saveConversation } from '@/lib/whatsapp/kv'
import { sendEscalationEmail } from '@/lib/whatsapp/mailer'
import { MENU_REGISTRY } from '@/lib/whatsapp/menus'
import type { ConversationState, ContactProfile, InboundMessage, StoredMessage, WhatsAppWebhookPayload } from '@/lib/whatsapp/types'

// nodejs runtime: usamos nodemailer (vía WA escalation email) y el SDK de
// Anthropic, igual que /api/intake.
export const runtime = 'nodejs'

const MAX_HISTORY_MESSAGES = 24

function getEnv(name: string): string | undefined {
  return process.env[name]
}

// --- Verificación de firma (X-Hub-Signature-256) -----------------------

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function verifySignature(rawBody: string, signatureHeader: string | null, appSecret: string): Promise<boolean> {
  const prefix = 'sha256='
  if (!signatureHeader || !signatureHeader.startsWith(prefix)) return false
  const providedHex = signatureHeader.slice(prefix.length)

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody))
  const computedHex = Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return timingSafeEqualHex(computedHex, providedHex)
}

// --- Verificación del webhook (Meta) ------------------------------------

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')
  const verifyToken = getEnv('WA_VERIFY_TOKEN')

  if (mode === 'subscribe' && challenge && verifyToken && token === verifyToken) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

// --- Recepción de mensajes ------------------------------------------------

export async function POST(request: Request) {
  const rawBody = await request.text()
  const appSecret = getEnv('WA_APP_SECRET')

  if (appSecret) {
    const signature = request.headers.get('x-hub-signature-256')
    const valid = await verifySignature(rawBody, signature, appSecret)
    if (!valid) {
      console.warn('Firma de webhook de WhatsApp inválida — se rechaza la solicitud.')
      return new Response('Invalid signature', { status: 401 })
    }
  } else {
    console.warn('WA_APP_SECRET no configurado: el webhook de WhatsApp no está verificando firmas.')
  }

  let payload: WhatsAppWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: true })
  }

  try {
    await handlePayload(payload)
  } catch (error) {
    // Meta reintenta agresivamente ante errores 5xx — devolvemos 200 igual
    // y dejamos el registro del error para diagnóstico.
    console.error('Error procesando webhook de WhatsApp:', error)
  }

  return NextResponse.json({ ok: true })
}

async function handlePayload(payload: WhatsAppWebhookPayload): Promise<void> {
  const changes = payload.entry?.flatMap((entry) => entry.changes) ?? []

  for (const change of changes) {
    const value = change.value
    const messages = value.messages ?? []
    if (messages.length === 0) continue

    const contactName = value.contacts?.[0]?.profile?.name

    for (const message of messages) {
      await handleInboundMessage(message, contactName)
    }
  }
}

async function handleInboundMessage(message: InboundMessage, contactName: string | undefined): Promise<void> {
  const isNew = await claimMessageOnce(message.id)
  if (!isNew) return

  const phone = message.from
  await markAsRead(message.id).catch((error) => console.error('No se pudo marcar como leído:', error))

  const userText = extractUserText(message)

  const existing = await loadConversation(phone)
  const isFirstContact = existing === null
  const profile = existing?.profile ?? createDefaultProfile(contactName)

  const decision = await decide({
    profile,
    history: existing?.messages ?? [],
    userText,
    isFirstContact,
  })

  await sendText(phone, decision.reply)

  if (decision.menu !== 'none') {
    const entry = MENU_REGISTRY[decision.menu]
    if (entry.kind === 'list') {
      await sendListMenu(phone, entry.menu)
    } else {
      await sendReplyButtons(phone, entry.menu)
    }
  }

  const updatedProfile = mergeProfile(profile, decision, contactName)

  if (decision.escalateToHuman) {
    await sendEscalationEmail({ phone, profile: updatedProfile, reason: decision.escalateReason }).catch((error) =>
      console.error('No se pudo enviar el correo de escalación:', error)
    )
  }

  const now = new Date().toISOString()

  const newMessages: StoredMessage[] = [
    { role: 'user', content: userText, ts: now },
    { role: 'assistant', content: decision.reply, ts: now },
  ]
  const history: StoredMessage[] = [...(existing?.messages ?? []), ...newMessages].slice(-MAX_HISTORY_MESSAGES)

  const state: ConversationState = {
    phone,
    profile: { ...updatedProfile, lastContactAt: now, messageCount: updatedProfile.messageCount + 1 },
    messages: history,
  }

  await saveConversation(state)
}

function extractUserText(message: InboundMessage): string {
  if (message.type === 'text') {
    return message.text.body
  }

  if (message.type === 'interactive') {
    const interactive = message.interactive
    const title = interactive.type === 'button_reply' ? interactive.button_reply.title : interactive.list_reply.title
    return `Eligió: "${title}"`
  }

  return `[El contacto envió un adjunto de tipo "${message.type}" que no podés ver. Pedile amablemente que resuma en texto lo que necesita.]`
}

function createDefaultProfile(contactName: string | undefined): ContactProfile {
  const now = new Date().toISOString()
  return {
    name: contactName ?? '',
    areaOfInterest: '',
    urgency: 'baja',
    leadStage: 'nuevo',
    notes: '',
    firstContactAt: now,
    lastContactAt: now,
    messageCount: 0,
  }
}

function mergeProfile(
  current: ContactProfile,
  decision: { profile: { name: string; areaOfInterest: string; urgency: ContactProfile['urgency']; leadStage: ContactProfile['leadStage']; notes: string } },
  contactName: string | undefined
): ContactProfile {
  return {
    ...current,
    name: decision.profile.name || current.name || contactName || '',
    areaOfInterest: decision.profile.areaOfInterest || current.areaOfInterest,
    urgency: decision.profile.urgency,
    leadStage: decision.profile.leadStage,
    notes: decision.profile.notes || current.notes,
  }
}
