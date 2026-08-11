// Tipos del payload de webhook de WhatsApp Cloud API (Meta) y del estado
// conversacional que persistimos nosotros. No es el shape completo de la
// API — solo los campos que este agente efectivamente usa.

export type InboundTextMessage = {
  id: string
  from: string
  timestamp: string
  type: 'text'
  text: { body: string }
}

export type InboundInteractiveMessage = {
  id: string
  from: string
  timestamp: string
  type: 'interactive'
  interactive:
    | { type: 'button_reply'; button_reply: { id: string; title: string } }
    | { type: 'list_reply'; list_reply: { id: string; title: string; description?: string } }
}

export type InboundOtherMessage = {
  id: string
  from: string
  timestamp: string
  type: 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'location' | 'contacts' | 'button' | 'order' | 'unknown'
}

export type InboundMessage = InboundTextMessage | InboundInteractiveMessage | InboundOtherMessage

export type WhatsAppContact = {
  profile: { name?: string }
  wa_id: string
}

export type WhatsAppWebhookPayload = {
  object?: string
  entry?: Array<{
    id: string
    changes: Array<{
      field: string
      value: {
        messaging_product: 'whatsapp'
        metadata?: { display_phone_number: string; phone_number_id: string }
        contacts?: WhatsAppContact[]
        messages?: InboundMessage[]
        statuses?: unknown[]
      }
    }>
  }>
}

// Urgencia percibida del contacto, usada tanto para tono de respuesta como
// para decidir si se dispara una escalación al estudio.
export type UrgencyLevel = 'baja' | 'media' | 'alta' | 'urgente'

export type LeadStage =
  | 'nuevo'
  | 'calificando'
  | 'evaluacion_agendada'
  | 'cliente'
  | 'derivado_urgente'
  | 'no_calificado'

// Lo que el agente "aprende" del contacto a medida que conversa. Se
// persiste en KV y se reinyecta en el prompt en cada turno siguiente.
export type ContactProfile = {
  name: string
  areaOfInterest: string
  urgency: UrgencyLevel
  leadStage: LeadStage
  notes: string
  firstContactAt: string
  lastContactAt: string
  messageCount: number
}

export type StoredMessage = {
  role: 'user' | 'assistant'
  content: string
  ts: string
}

export type ConversationState = {
  phone: string
  profile: ContactProfile
  messages: StoredMessage[]
}

export type MenuId = 'none' | 'main_menu' | 'confirm_human'

export type AgentDecision = {
  reply: string
  menu: MenuId
  escalateToHuman: boolean
  escalateReason: string
  profile: {
    name: string
    areaOfInterest: string
    urgency: UrgencyLevel
    leadStage: LeadStage
    notes: string
  }
}
