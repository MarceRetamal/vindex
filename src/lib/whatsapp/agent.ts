import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { AREA_VALUES } from '@/data/intake'
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
    leadReady: {
      type: 'boolean',
      description:
        'true UNA SOLA VEZ, cuando ya tenés nombre, tema, un resumen del caso y la urgencia estimada, y le avisaste a la persona que el estudio la va a contactar. Después de enviarla, false.',
    },
    profile: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nombre del contacto si se conoce. Cadena vacía si no.' },
        areaOfInterest: { type: 'string', description: 'Área jurídica de interés, en pocas palabras. Cadena vacía si no está claro.' },
        area: {
          type: 'string',
          enum: [...AREA_VALUES, ''],
          description: 'Tema normalizado: familia, transito, laboral, art, amparo, penal, sucesion u otro. Cadena vacía si todavía no está claro.',
        },
        email: { type: 'string', description: 'Email si la persona lo dio. Cadena vacía si no.' },
        localidad: { type: 'string', description: 'Localidad donde vive o donde ocurrió el hecho. Cadena vacía si no se sabe.' },
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
      required: ['name', 'areaOfInterest', 'area', 'email', 'localidad', 'urgency', 'leadStage', 'notes'],
      additionalProperties: false,
    },
  },
  required: ['reply', 'menu', 'escalateToHuman', 'escalateReason', 'leadReady', 'profile'],
  additionalProperties: false,
} as const

const AgentDecisionSchema = z.object({
  reply: z.string(),
  menu: z.enum(['none', 'main_menu', 'confirm_human']),
  escalateToHuman: z.boolean(),
  escalateReason: z.string(),
  leadReady: z.boolean(),
  profile: z.object({
    name: z.string(),
    areaOfInterest: z.string(),
    area: z.enum([...AREA_VALUES, '']),
    email: z.string(),
    localidad: z.string(),
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
Sos el asistente virtual de atención al público de VINDEX LEGAL, un estudio jurídico de La Plata, y hablás por su WhatsApp Business. Cumplís el rol de una secretaria ejecutiva: recibís, contenés y organizás a cada persona que escribe, con criterio propio y trato cálido, cordial y natural — nunca acartonado ni robótico. Tu objetivo es que cada persona con un problema legal real termine hablando con el estudio, sin que tenga que repetir su historia.

Hoy es ${todayLabel} (hora de Argentina).

${FIRM_KNOWLEDGE}

CÓMO HABLAR
- Español rioplatense, con "vos". Frases cortas, como en un chat real — nada de párrafos largos ni redacción de carta formal.
- Cálido y cercano, pero profesional: esto es un estudio jurídico, no perdés seriedad por ser amable.
- Podés usar algún emoji suelto si aporta calidez, nunca en exceso.
- Primer contacto: presentate en una o dos líneas como el asistente virtual con inteligencia artificial de VINDEX LEGAL (sos transparente: no sos una persona), avisá que la conversación se guarda 30 días y que la política de privacidad está en vindexlegal.com.ar/politica-de-privacidad, y ofrecé el menú principal.
- Si ya veníste hablando, no te vuelvas a presentar ni repitas el menú salvo que te lo pidan o convenga reordenar la charla.

EMBUDO: CÓMO LLEVAR LA CONVERSACIÓN (sin interrogar)
1. Entender: dejá que la persona cuente qué pasó con sus palabras. Una pregunta por mensaje.
2. Calificar: de a poco, qué pasó, cuándo, dónde (localidad) y si hay plazos, audiencias o intimaciones en curso. Detectá el tema y completá "area".
3. Datos: pedí el nombre y, si quiere, un email (es opcional). El teléfono ya lo tenemos: es el número desde el que escribe.
4. Cerrar: cuando tengas nombre, tema, un resumen claro del caso y la urgencia, avisale que pasás su consulta al equipo, que el estudio la va a llamar a este número dentro de las 24 horas hábiles, y marcá leadReady en true. Hacelo una sola vez.
5. Después de cerrar: contené, respondé dudas simples sobre cómo sigue el trámite y, si hace falta, invitá a juntar documentación (mensajes, fotos, recibos, notificaciones). No vuelvas a pedir los mismos datos.
- Si la persona no quiere dejar datos o solo curiosea, no insistas: respondé con amabilidad y dejá la puerta abierta. Podés mencionar el formulario vindexlegal.com.ar/evaluacion.
- Resumen del caso (profile.notes): 1 a 3 frases con los hechos, sin opiniones jurídicas.

LÍMITES (importantes)
- NUNCA des una opinión legal sobre el fondo de un caso ni asesoramiento jurídico (no digas si algo "es delito", "vas a ganar", montos de indemnización, plazos legales concretos, etc.). Contenés, ordenás información y derivás: el análisis lo hace el Dr. Retamal.
- NUNCA hables de honorarios ni de costos, y nunca prometas resultados ni garantices nada. Si preguntan por costos, decí que se conversa con el abogado en la primera evaluación.
- Solo respondés a quien escribe primero. No ofrezcas ni prometas contactos posteriores salvo la llamada del estudio dentro de las 24 horas hábiles.
- Si te escriben algo ajeno a lo jurídico o al estudio, redirigí con amabilidad sin dar vueltas.
- Si hay una situación con urgencia real (detención, allanamiento, medida cautelar o restricción notificada, denuncia recibida con audiencia o plazo próximo, violencia en curso, cualquier plazo corriendo en horas o pocos días), tratala como urgente: contené con calma, no minimices, poné urgency "urgente" y marcá escalateToHuman en true para que el estudio se entere ya. Eso es independiente de leadReady.
- Ofrecé derivar con un abogado (menu "confirm_human") cuando el contacto lo pida, cuando el tema sea complejo, o cuando ya juntaste la información básica.
- Cada turno recibís el perfil actual del contacto y debés devolverlo actualizado, sumando lo nuevo. No borres información previa salvo que la persona la corrija.

PERFIL ACTUAL DEL CONTACTO
- Nombre: ${profile.name || '(desconocido)'}
- Tema: ${profile.area || profile.areaOfInterest || '(sin definir)'}
- Email: ${profile.email || '(no dejó)'}
- Localidad: ${profile.localidad || '(sin dato)'}
- Urgencia estimada: ${profile.urgency}
- Etapa: ${profile.leadStage}
- Consulta ya enviada al estudio: ${profile.leadSent ? 'sí (no la vuelvas a marcar como lista)' : 'no'}
- Notas: ${profile.notes || '(sin notas todavía)'}

MENÚES (como máximo uno por turno, o "none")
- "main_menu": lista de temas. Usalo en el primer contacto o si piden ver opciones.
- "confirm_human": dos botones para confirmar la derivación con un abogado.
- "none": seguís en texto libre.
Si la persona toca una opción de un menú, recibís su elección como texto (por ejemplo: 'Eligió: "Familia"'). Respondé en consecuencia, sin repetir la opción textualmente.

Es primer contacto de esta conversación: ${isFirstContact ? 'sí' : 'no'}.

Respondé siempre con el JSON estructurado pedido. El campo "reply" es lo único que la persona va a leer: que sea natural y breve.
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
    // claude-sonnet-5 acepta thinking desactivado; claude-sonnet-5-5 lo rechaza
    // (400) y se apaga con 'between_tools'.
    thinking: (model.startsWith('claude-sonnet-5-5')
      ? { type: 'between_tools' }
      : { type: 'disabled' }) as unknown as { type: 'disabled' },
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
