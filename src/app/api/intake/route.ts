import { NextResponse } from 'next/server'
import { z } from 'zod'
import { AREA_VALUES, URGENCIA_VALUES, LIMITES } from '@/data/intake'
import {
  getEnv,
  getTransporter,
  sendCourtesyEmail,
  sendInstitutionalEmail,
  type IntakePayload,
  type Transporter,
} from '@/lib/intake/correo'
import { guardarPendiente } from '@/lib/intake/pendientes'
import { ipExcedida, telefonoExcedido } from '@/lib/intake/limite'
import { normalizarTelefonoWhatsApp } from '@/lib/intake/telefono'
import { getCloudflareContext } from '@opennextjs/cloudflare'
export const runtime = 'nodejs'

// 🛡️ VALIDACIÓN SERVER-SIDE — espejo del esquema del formulario, pero acá es
// la que realmente importa: el navegador se puede saltear, esto no.
const intakeSchema = z.object({
  name: z.string().trim().min(LIMITES.nombreMin, 'El nombre es obligatorio.').max(LIMITES.nombreMax, 'El nombre es demasiado largo.'),
  phone: z.string().trim().min(LIMITES.telefonoMin, 'El teléfono es obligatorio.').max(LIMITES.telefonoMax, 'El teléfono es demasiado largo.'),
  email: z.union([z.literal(''), z.string().trim().email('Email inválido.').max(LIMITES.emailMax, 'El email es demasiado largo.')]).optional(),
  localidad: z.string().trim().max(LIMITES.localidadMax, 'La localidad es demasiado larga.').optional(),
  area: z.enum(AREA_VALUES),
  urgency: z.enum(URGENCIA_VALUES),
  message: z.string().trim().min(LIMITES.mensajeMin, 'La descripción requiere mayor detalle.').max(LIMITES.mensajeMax, `La descripción no debe superar los ${LIMITES.mensajeMax} caracteres.`),
  website: z.string().optional(),
})

// 3. MENSAJES DE WHATSAPP (tres plantillas, en orden)
// NOTA: el texto de estos tres mensajes lo definen las plantillas aprobadas en
// Meta (vindex LEGAL_admision_v2_parte1/2/3), no este código. Si querés cambiar
// el tono, hay que crear y aprobar plantillas nuevas en Meta Business.
// Meta retira cada versión a los ~2 años (la v18.0 venció el 26/1/2026).
// Revisar el calendario en developers.facebook.com → Graph API → Changelog.
const WHATSAPP_API = 'https://graph.facebook.com/v25.0'
const PLANTILLA_WHATSAPP = 'vindex LEGAL_admision_v2_parte'

async function enviarPlantillaWhatsApp(
  credenciales: { phoneNumberID: string; accessToken: string },
  destino: string,
  parte: 1 | 2 | 3,
  components: unknown[]
) {
  const response = await fetch(`${WHATSAPP_API}/${credenciales.phoneNumberID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credenciales.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: destino,
      type: 'template',
      template: {
        name: `${PLANTILLA_WHATSAPP}${parte}`,
        language: { code: 'es_AR' },
        components,
      },
    }),
  })

  if (!response.ok) {
    // Solo se registra el código del error: el cuerpo completo puede traer el
    // teléfono de quien consultó. El cuerpo puede no ser JSON.
    const errData = (await response.json().catch(() => null)) as
      | { error?: { code?: number; type?: string; fbtrace_id?: string } }
      | null
    console.error(`Meta API rechazó la Parte ${parte}:`, {
      status: response.status,
      code: errData?.error?.code,
      type: errData?.error?.type,
      fbtrace_id: errData?.error?.fbtrace_id,
    })
  }
}

async function sendWhatsAppNotification(payload: IntakePayload, requestID: string) {
  try {
    const credenciales = { phoneNumberID: getEnv('WA_PHONE_NUMBER_ID'), accessToken: getEnv('WA_ACCESS_TOKEN') }
    const logoUrl = getEnv('WA_LOGO_URL')
    const destino = normalizarTelefonoWhatsApp(payload.phone)

    // Parte 1: saludo con el logo y el número de referencia de la consulta.
    await enviarPlantillaWhatsApp(credenciales, destino, 1, [
      { type: 'header', parameters: [{ type: 'image', image: { link: logoUrl } }] },
      {
        type: 'body',
        parameters: [
          { type: 'text', text: payload.name },
          { type: 'text', text: requestID },
        ],
      },
    ])
    // Parte 2 y 3: texto fijo de la plantilla, sin variables.
    await enviarPlantillaWhatsApp(credenciales, destino, 2, [])
    await enviarPlantillaWhatsApp(credenciales, destino, 3, [])
  } catch (waError) {
    console.error('Error de conexión con la infraestructura de WhatsApp:', waError)
  }
}

// Ejecuta una tarea después de responder, con ctx.waitUntil del Worker:
// Cloudflare la deja terminar aunque la respuesta ya haya salido. Fuera del
// Worker (next dev / next start no tienen ese contexto), la espera como antes.
async function enSegundoPlano(tarea: () => Promise<void>) {
  let ctx: { waitUntil(promesa: Promise<unknown>): void } | undefined
  try {
    ctx = getCloudflareContext().ctx
  } catch {
    ctx = undefined
  }
  if (ctx) ctx.waitUntil(tarea())
  else await tarea()
}

// 🔒 Verifica el token de Turnstile contra la API de Cloudflare (siteverify).
// Si esto falla o no está bien configurado, el envío se rechaza — nunca se
// asume "humano" por defecto.
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean | 'error'> {
  const secret = getEnv('TURNSTILE_SECRET_KEY')

  const formData = new URLSearchParams()
  formData.append('secret', secret)
  formData.append('response', token)
  if (remoteIp) formData.append('remoteip', remoteIp)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) return 'error'
    const outcome = (await response.json()) as { success?: boolean }
    return outcome.success === true
  } catch (error) {
    console.error('No se pudo consultar Turnstile:', error)
    return 'error'
  }
}

// Número de referencia de la consulta (VX-XXXXXX). 6 caracteres de un alfabeto
// de 32 sin letras que se confunden (I, O, 0, 1): ~1.000 millones de combinaciones,
// con números aleatorios criptográficos (&31 sobre un byte no introduce sesgo).
const ALFABETO_ID = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function generarRequestID(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return 'VX-' + Array.from(bytes, (b) => ALFABETO_ID[b & 31]).join('')
}

// 4. ENRUTADOR POST PRINCIPAL
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<IntakePayload> & { turnstileToken?: string }

    // Honeypot: si el campo oculto viene completo, es un bot. Respondemos
    // "éxito" sin procesar nada, para no revelarle que fue detectado.
    if (String(body.website ?? '').trim()) {
      return NextResponse.json({ ok: true, warnings: [] })
    }

    const clientIp = request.headers.get('CF-Connecting-IP')

    // Límite por IP, antes de gastar una llamada a Turnstile.
    if (await ipExcedida(clientIp)) {
      return NextResponse.json(
        { ok: false, error: 'Recibimos muchos intentos desde tu conexión. Esperá un minuto e intentá de nuevo.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // 🔒 CAPTCHA invisible (Cloudflare Turnstile) — se verifica antes que nada.
    const turnstileToken = String(body.turnstileToken ?? '').trim()
    if (!turnstileToken) {
      return NextResponse.json(
        { ok: false, error: 'Verificación de seguridad requerida. Recargá la página e intentá de nuevo.' },
        { status: 400 }
      )
    }

    const isHuman = await verifyTurnstile(turnstileToken, clientIp)
    if (isHuman === 'error') {
      return NextResponse.json(
        { ok: false, error: 'No pudimos completar la verificación de seguridad. Intentá de nuevo en unos minutos.' },
        { status: 503 }
      )
    }
    if (!isHuman) {
      return NextResponse.json(
        { ok: false, error: 'No pudimos verificar que sos una persona. Intentá de nuevo.' },
        { status: 400 }
      )
    }

    // 🎯 VALIDACIÓN DEL LADO DEL SERVIDOR
    const parsed = intakeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos. Revisá los campos del formulario.' },
        { status: 400 }
      )
    }

    const payload: IntakePayload = parsed.data

    // Tope de consultas por teléfono: evita usar el sitio para escribirle a un tercero.
    if (await telefonoExcedido(normalizarTelefonoWhatsApp(payload.phone))) {
      return NextResponse.json(
        { ok: false, error: 'Ya recibimos varias consultas con este teléfono. Te vamos a contactar a la brevedad.' },
        { status: 429 }
      )
    }

    const requestID = generarRequestID()

    // El correo al estudio es lo que no puede perderse. Si falla, la consulta
    // se guarda y una tarea programada reintenta el envío cada 10 minutos:
    // para quien consulta, la consulta ya está recibida. Solo si tampoco se
    // puede guardar, se responde con error para que vuelva a intentar.
    let transporter: Transporter | null = null
    try {
      transporter = getTransporter()
      await sendInstitutionalEmail(transporter, payload)
    } catch (errorCorreo) {
      console.error(`Correo al estudio fallido; la consulta ${requestID} queda guardada para reintentar:`, errorCorreo)
      await guardarPendiente(payload, requestID, errorCorreo)
    }

    // Lo que sigue es secundario y no cambia la respuesta: la confirmación a
    // quien consulta (si dejó email) y los mensajes de WhatsApp. Si fallan, se
    // registra y la persona no ve un error (la consulta ya llegó y reintentar
    // la duplicaría). Corren en segundo plano: la persona ve "Consulta
    // recibida" sin esperar a Gmail ni a Meta.
    const tareasSecundarias = async () => {
      try {
        await sendCourtesyEmail(transporter ?? getTransporter(), payload, requestID)
      } catch (courtesyError) {
        console.error('No se pudo enviar el correo de confirmación:', courtesyError)
      }
      // Mensajes de WhatsApp (plantillas aprobadas en Meta)
      await sendWhatsAppNotification(payload, requestID)
    }
    await enSegundoPlano(tareasSecundarias)

    return NextResponse.json({ ok: true, warnings: [] })
  } catch (error) {
    console.error('Error procesando intake:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo procesar la solicitud.' }, { status: 500 })
  }
}
