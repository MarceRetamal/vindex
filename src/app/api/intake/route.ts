import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  AREA_LABELS,
  AREA_VALUES,
  URGENCIA_LABELS,
  URGENCIA_VALUES,
  LIMITES,
  type AreaValue,
  type UrgenciaValue,
} from '@/data/intake'
export const runtime = 'nodejs'

type IntakePayload = {
  name: string
  phone: string
  email?: string
  localidad?: string
  area: AreaValue
  urgency: UrgenciaValue
  message: string
  website?: string
}
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

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`)
  }
  return value
}

function parseBoolean(value: string | undefined, fallback = false) {
  if (value === undefined) return fallback
  return value.toLowerCase() === 'true'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

type Transporter = ReturnType<typeof nodemailer.createTransport>

function getTransporter(): Transporter {
  const smtpHost = getEnv('SMTP_HOST')
  const smtpPort = Number(getEnv('SMTP_PORT'))
  const smtpSecure = parseBoolean(process.env.SMTP_SECURE, true)
  const smtpUser = getEnv('SMTP_USER')
  const smtpPass = getEnv('SMTP_PASS')

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
}

// 1. CORREO INTERNO (llega al estudio)
async function sendInstitutionalEmail(transporter: Transporter, payload: IntakePayload) {
  const areaLabel = AREA_LABELS[payload.area]
  const urgencyLabel = URGENCIA_LABELS[payload.urgency]
  const localidad = payload.localidad?.trim() || 'No indicó'
  const email = payload.email?.trim() || 'No dejó email'

  const subject = `[VINDEX LEGAL] Nueva consulta — ${areaLabel} — ${payload.name}`
  const text = `Nueva consulta recibida desde vindexlegal.com.ar\n\nNombre: ${payload.name}\nTeléfono: ${payload.phone}\nEmail: ${email}\nLocalidad: ${localidad}\nTema: ${areaLabel}\nUrgencia: ${urgencyLabel}\n\nQué cuenta:\n${payload.message}`.trim()

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Nueva consulta recibida desde vindexlegal.com.ar</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(payload.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Localidad:</strong> ${escapeHtml(localidad)}</p>
      <p><strong>Tema:</strong> ${escapeHtml(areaLabel)}</p>
      <p><strong>Urgencia:</strong> ${escapeHtml(urgencyLabel)}</p>
      <hr />
      <p><strong>Qué cuenta:</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, '<br />')}</p>
    </div>
  `

  const mailFrom = getEnv('MAIL_FROM')
  const mailTo = getEnv('MAIL_TO')

  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    // Solo se responde por mail si la persona dejó uno.
    ...(payload.email?.trim() ? { replyTo: payload.email.trim() } : {}),
    subject,
    text,
    html,
  })
}

// 2. CORREO DE CONFIRMACIÓN (para quien consulta; solo si dejó email)
async function sendCourtesyEmail(transporter: Transporter, payload: IntakePayload, requestID: string) {
  const to = payload.email?.trim()
  if (!to) return

  const areaLabel = AREA_LABELS[payload.area]
  const subject = `Recibimos tu consulta — VINDEX LEGAL`
  const text = `VINDEX LEGAL — Estudio jurídico en La Plata\n--------------------------------------------------\nReferencia: ${requestID}\n\nHola ${payload.name},\n\nRecibimos tu consulta sobre: ${areaLabel}.\n\nLa vamos a leer con atención y te llamamos dentro de las próximas 24 horas hábiles al ${payload.phone}.\n\nMientras tanto, guardá todo lo que tengas relacionado: mensajes, documentos, fotos, recibos y notificaciones.\n\nEsta confirmación no implica que aceptemos el caso ni genera una relación profesional hasta que lo conversemos.\n\nVINDEX LEGAL\nhttps://vindexlegal.com.ar`.trim()

  const html = `
    <div style="background-color: #0B0F17; font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; text-align: center; color: #F3F4F6;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 8px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <div style="margin-bottom: 35px; border-bottom: 1px solid #1F2937; padding-bottom: 20px;">
          <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; font-family: sans-serif;">V I N D E X</td>
              <td align="right"><span style="font-size: 11px; color: #9CA3AF; letter-spacing: 1px; font-family: monospace; background-color: #1F2937; padding: 4px 8px; border-radius: 4px;">CONSULTA RECIBIDA</span></td>
            </tr>
          </table>
        </div>
        <p style="font-size: 14px; color: #9CA3AF; font-family: monospace; margin-bottom: 25px; margin-top: 0;">REF: ${requestID}</p>
        <p style="font-size: 16px; line-height: 1.6; color: #E5E7EB; margin-bottom: 20px;">Hola <strong>${escapeHtml(payload.name)}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 18px;">Recibimos tu consulta sobre <strong>${escapeHtml(areaLabel)}</strong>. La vamos a leer con atención y te llamamos dentro de las próximas <strong>24 horas hábiles</strong> al <span style="color: #FFFFFF; font-weight: 600;">${escapeHtml(payload.phone)}</span>.</p>
        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 18px;">Mientras tanto, guardá todo lo que tengas relacionado con tu caso: mensajes, documentos, fotos, recibos y notificaciones.</p>
        <p style="font-size: 13px; line-height: 1.6; color: #9CA3AF; margin-bottom: 35px;">Esta confirmación no implica que aceptemos el caso ni genera una relación profesional hasta que lo conversemos.</p>
        <div style="border-top: 1px solid #1F2937; padding-top: 25px; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
          <p style="margin: 0 0 5px 0; color: #F3F4F6; font-weight: bold;">VINDEX LEGAL — Estudio jurídico en La Plata</p>
          <p style="margin: 0;"><a href="https://vindexlegal.com.ar" style="color: #9CA3AF; text-decoration: none; border-bottom: 1px dashed #4B5563;">vindexlegal.com.ar</a></p>
        </div>
      </div>
    </div>
  `

  const mailFrom = getEnv('MAIL_FROM')

  await transporter.sendMail({
    from: mailFrom,
    to,
    subject,
    text,
    html,
  })
}

// 3. MENSAJES DE WHATSAPP (tres plantillas, en orden)
// NOTA: el texto de estos tres mensajes lo definen las plantillas aprobadas en
// Meta (vindex LEGAL_admision_v2_parte1/2/3), no este código. Si querés cambiar
// el tono, hay que crear y aprobar plantillas nuevas en Meta Business.
const WHATSAPP_API = 'https://graph.facebook.com/v18.0'
const PLANTILLA_WHATSAPP = 'vindex LEGAL_admision_v2_parte'

// Lleva el teléfono que escribió la persona al formato internacional que pide
// la API de WhatsApp (549...). Solo reconoce los prefijos listados: un número
// cargado como 221..., 0221... o con 15 se envía tal cual (ver el informe de
// arquitectura antes de ampliarlo, porque cambia a quién le llega el mensaje).
function normalizarTelefonoWhatsApp(telefono: string): string {
  const soloDigitos = telefono.replace(/\D/g, '')
  if (soloDigitos.startsWith('5409')) return '549' + soloDigitos.substring(4)
  if (soloDigitos.startsWith('549')) return soloDigitos
  if (['11', '34', '26', '35'].some((prefijo) => soloDigitos.startsWith(prefijo))) return '549' + soloDigitos
  return soloDigitos
}

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
    const errData = await response.json()
    console.error(`Meta API rechazó la Parte ${parte}:`, errData)
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

// 🔒 Verifica el token de Turnstile contra la API de Cloudflare (siteverify).
// Si esto falla o no está bien configurado, el envío se rechaza — nunca se
// asume "humano" por defecto.
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = getEnv('TURNSTILE_SECRET_KEY')

  const formData = new URLSearchParams()
  formData.append('secret', secret)
  formData.append('response', token)
  if (remoteIp) formData.append('remoteip', remoteIp)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })

  const outcome = (await response.json()) as { success: boolean }
  return outcome.success === true
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

    // 🔒 CAPTCHA invisible (Cloudflare Turnstile) — se verifica antes que nada.
    const turnstileToken = String(body.turnstileToken ?? '').trim()
    if (!turnstileToken) {
      return NextResponse.json(
        { ok: false, error: 'Verificación de seguridad requerida. Recargá la página e intentá de nuevo.' },
        { status: 400 }
      )
    }

    const clientIp = request.headers.get('CF-Connecting-IP')
    const isHuman = await verifyTurnstile(turnstileToken, clientIp)
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

    const requestID = `VX-${Math.floor(10000 + Math.random() * 90000)}`

    // El correo al estudio es lo que no puede fallar: si sale bien, la consulta
    // ya está entregada.
    const transporter = getTransporter()
    await sendInstitutionalEmail(transporter, payload)

    // La confirmación a quien consulta es secundaria: si falla, se registra pero
    // no se le muestra un error (la consulta ya llegó y reintentar la duplicaría).
    try {
      await sendCourtesyEmail(transporter, payload, requestID)
    } catch (courtesyError) {
      console.error('No se pudo enviar el correo de confirmación:', courtesyError)
    }

    // Mensajes de WhatsApp (plantillas aprobadas en Meta)
    await sendWhatsAppNotification(payload, requestID)

    return NextResponse.json({ ok: true, warnings: [] })
  } catch (error) {
    console.error('Error procesando intake:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo procesar la solicitud.' }, { status: 500 })
  }
}
