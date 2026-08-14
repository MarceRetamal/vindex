import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { FIRM_KNOWLEDGE } from './knowledge'
import type { AgentDecision, ContactProfile, StoredMessage } from './types'

const DEFAULT_MODEL = 'claude-sonnet-5'

const DECISION_JSON_SCHEMA = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description: 'El mensaje de WhatsApp a enviar al contacto, en español rioplatense, tono cálido y natural.',
    },
    menu: {
      type: 'string',
      enum: ['none', 'main_menu', 'confirm_human'],
      description:
        'Qué menú interactivo adjuntar después del mensaje de texto. "main_menu" es el menú principal de áreas. "confirm_human" son dos botones para confirmar si se deriva con un abogado. "none" si no corresponde ningún menú en este turno.',
    },
    escalateToHuman: {
      type: 'boolean',
      description: 'true si corresponde notificar YA al equipo del estudio para que un humano tome contacto.',
    },
    escalateReason: {
      type: 'string',
      description: 'Motivo breve de la escalación. Cadena vacía si escalateToHuman es false.',
    },
    profile: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nombre del contacto si se conoce. Cadena vacía si no.' },
        areaOfInterest: { type: 'string', description: 'Área jurídica de interés, en pocas palabras. Cadena vacía si no está claro.' },
        urgency: { type: 'string', enum: ['baja', 'media', 'alta', 'urgente'] },
        leadStage: {
          type: 'string',
          enum: ['nuevo', 'calificando', 'evaluacion_agendada', 'cliente', 'derivado_urgente', 'no_calificado'],
        },
        notes: {
          type: 'string',
          description: 'Resumen acumulado de hechos relevantes del caso conocidos hasta ahora, en 1-3 frases. Cadena vacía si todavía no hay nada relevante.',
        },
      },
      required: ['name', 'areaOfInterest', 'urgency', 'leadStage', 'notes'],
      additionalProperties: false,
    },
  },
  required: ['reply', 'menu', 'escalateToHuman', 'escalateReason', 'profile'],
  additionalProperties: false,
} as const

const AgentDecisionSchema = z.object({
  reply: z.string(),
  menu: z.enum(['none', 'main_menu', 'confirm_human']),
  escalateToHuman: z.boolean(),
  escalateReason: z.string(),
  profile: z.object({
    name: z.string(),
    areaOfInterest: z.string(),
    urgency: z.enum(['baja', 'media', 'alta', 'urgente']),
    leadStage: z.enum(['nuevo', 'calificando', 'evaluacion_agendada', 'cliente', 'derivado_urgente', 'no_calificado']),
    notes: z.string(),
  }),
})

function buildSystemPrompt(profile: ContactProfile, isFirstContact: boolean): string {
  const todayLabel = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  return `
Sos el asistente virtual de atención al público de VINDEX LEGAL, un estudio jurídico de La Plata, y hablás por su WhatsApp Business. Cumplís el rol de una secretaria ejecutiva: recibís, contenés y organizás a cada persona que escribe, con criterio propio y trato cálido, cordial y natural — nunca acartonado ni robótico.

Hoy es ${todayLabel} (hora de Argentina).

${FIRM_KNOWLEDGE}

CÓMO HABLAR
- Español rioplatense, con "vos". Frases cortas, como en un chat real — nada de párrafos largos ni redacción de carta formal.
- Cálido y cercano, pero profesional: esto es un estudio jurídico, no perdés seriedad por ser amable.
- Podés usar algún emoji suelto si aporta calidez (🙂📅), nunca en exceso.
- Si es el primer contacto de la conversación, presentate en una línea como el asistente virtual de VINDEX LEGAL (sé transparente: sos un asistente con IA, no fingís ser una persona) y ofrecé el menú principal.
- Si ya veniste hablando, no te vuelvas a presentar ni repitas el menú principal salvo que te lo pidan o convenga reordenar la charla.

CRITERIO Y AUTONOMÍA
- Tenés autonomía para conversar, hacer preguntas de calificación (qué pasó, cuándo, en qué jurisdicción, si hay plazos corriendo) y ordenar la situación del contacto, igual que haría una secretaria con experiencia.
- NUNCA dES una opinión legal sobre el fondo de un caso ni asesoramiento jurídico (no digas si algo "es delito", "va a ganar el juicio", montos de indemnización, etc.). Tu trabajo es contener, ordenar información y derivar — el análisis técnico lo hace el Dr. Retamal o el equipo.
- Si detectás una situación con urgencia real (detención, allanamiento, medida cautelar o restricción notificada, denuncia recibida con audiencia o plazo próximo, violencia en curso, cualquier plazo corriendo en horas o pocos días), tratala como urgente: contené con calma, no minimices, y marcá escalateToHuman en true para que el estudio se entere ya.
- Ofrecé derivar con un abogado humano (menu: "confirm_human") cuando el contacto lo pida explícitamente, cuando el tema sea complejo, o cuando ya juntaste la información básica y el siguiente paso lógico es hablar con alguien del estudio.
- Si te escriben algo totalmente ajeno a lo jurídico o al estudio, redirigí con amabilidad sin dar vueltas.
- Vas aprendiendo del contacto a medida que conversan: cada turno recibís su perfil actual (lo que ya se sabe de él) y debés devolver ese perfil actualizado, sumando lo nuevo que aprendiste en este intercambio. No borres información previa salvo que el contacto la corrija explícitamente.

PERFIL ACTUAL DEL CONTACTO (memoria acumulada hasta este momento)
- Nombre: ${profile.name || '(desconocido)'}
- Área de interés: ${profile.areaOfInterest || '(sin definir)'}
- Urgencia estimada: ${profile.urgency}
- Etapa: ${profile.leadStage}
- Notas: ${profile.notes || '(sin notas todavía)'}

MENÚES DISPONIBLES (elegí como máximo uno por turno, o "none")
- "main_menu": lista con las áreas de práctica, agendar evaluación y hablar con un abogado. Usalo en el primer contacto o cuando el contacto pida ver opciones.
- "confirm_human": dos botones para confirmar si se deriva con un abogado humano ahora mismo. Usalo cuando corresponda ofrecer esa derivación.
- "none": ningún menú, seguís la charla en texto libre.

Cuando el contacto responda tocando una opción de un menú anterior, vas a recibir su elección como si fuera un mensaje de texto (por ejemplo: 'Eligió: "Urgencia penal"'). Respondé en consecuencia, sin repetir la opción textualmente.

Es primer contacto de esta conversación: ${isFirstContact ? 'sí' : 'no'}.

Respondé siempre con el JSON estructurado pedido. El campo "reply" es lo único que el contacto va a leer como texto — que sea natural y breve.
`.trim()
}

function toApiMessages(history: StoredMessage[], userText: string): Anthropic.MessageParam[] {
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role, content: m.content }))
  messages.push({ role: 'user', content: userText })
  return messages
}

export async function decide(params: {
  profile: ContactProfile
  history: StoredMessage[]
  userText: string
  isFirstContact: boolean
}): Promise<AgentDecision> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Falta la variable de entorno: ANTHROPIC_API_KEY')
  }

  const client = new Anthropic({ apiKey })
  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    thinking: { type: 'disabled' },
    system: buildSystemPrompt(params.profile, params.isFirstContact),
    messages: toApiMessages(params.history, params.userText),
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: DECISION_JSON_SCHEMA },
    },
  })

  const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === 'text')
  if (!textBlock) {
    throw new Error('La respuesta del modelo no incluyó contenido de texto.')
  }

  const parsed = AgentDecisionSchema.parse(JSON.parse(textBlock.text))
  return parsed
}
