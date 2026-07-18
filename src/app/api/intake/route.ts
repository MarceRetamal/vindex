import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export const runtime = 'nodejs'

type IntakePayload = {
  name: string
  email: string
  phone: string
  jurisdiction: string
  urgency: string
  message: string
  website?: string
}
// 🛡️ VALIDACIÓN SERVER-SIDE — espejo del esquema del formulario, pero acá es
// la que realmente importa: el navegador se puede saltear, esto no.
const intakeSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es obligatorio.').max(120, 'El nombre es demasiado largo.'),
  email: z.string().trim().email('Email inválido.').max(200, 'El email es demasiado largo.'),
  phone: z.string().trim().min(6, 'El teléfono es obligatorio.').max(30, 'El teléfono es demasiado largo.'),
  jurisdiction: z.string().trim().min(2, 'La jurisdicción es obligatoria.').max(200, 'La jurisdicción es demasiado larga.'),
  urgency: z.enum(['plazo_corriendo', 'medida_notificada', 'conflicto_preventivo', 'auditoria_estrategia']),
  message: z.string().trim().min(10, 'La descripción requiere mayor detalle.').max(800, 'La síntesis no debe superar los 800 caracteres.'),
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

function getTransporter() {
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

// Diccionario para formatear los plazos en los emails internos del estudio
const urgencyLabels: Record<string, string> = {
  plazo_corriendo: 'Plazo judicial / procesal corriendo (Urgente)',
  medida_notificada: 'Medida cautelar o intimación notificada',
  conflicto_preventivo: 'Conflicto abierto sin curso judicial (Fase preventiva)',
  auditoria_estrategia: 'Auditoría de riesgos o diseño de estrategia de fondo'
}

// 1. CORREO INSTITUCIONAL (Notificación refinada para tu estudio)
async function sendInstitutionalEmail(payload: IntakePayload) {
  const humanUrgency = urgencyLabels[payload.urgency] || payload.urgency
  const subject = `[VINDEX] Nueva evaluación jurídica — ${payload.name}`
  const text = `Nuevo potencial cliente recibido desde vindex.website\n\nNombre: ${payload.name}\nEmail: ${payload.email}\nTeléfono: ${payload.phone}\nJurisdicción: ${payload.jurisdiction}\nEstado de plazos: ${humanUrgency}\n\nMensaje:\n${payload.message}`.trim()

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Nueva evaluación jurídica recibida desde vindex.website</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(payload.phone)}</p>
      <p><strong>Jurisdicción Principal:</strong> ${escapeHtml(payload.jurisdiction)}</p>
      <p><strong>Estado de Plazos Legales:</strong> ${escapeHtml(humanUrgency)}</p>
      <hr />
      <p><strong>Mensaje / Síntesis Estructural:</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, '<br />')}</p>
    </div>
  `

  const mailFrom = getEnv('MAIL_FROM')
  const mailTo = getEnv('MAIL_TO')
  const transporter = getTransporter()

  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: payload.email,
    subject,
    text,
    html,
  })
}

// 2. CORREO DE CORTESÍA PREMIUM (Para el cliente)
async function sendCourtesyEmail(payload: IntakePayload, requestID: string) {
  const subject = `Confirmación de ingreso: Protocolo de Evaluación — VINDEX`
  const text = `ESTUDIO JURÍDICO VINDEX — DIRECCIÓN DE ADMISIÓN\n--------------------------------------------------\nID de Solicitud: ${requestID}\nDestinatario: ${payload.name}\n\nLe confirmamos que los datos han sido indexados correctamente.\n\nGabinete de Estrategia Jurídica — VINDEX\nhttps://vindexlegal.com.ar`.trim()

  const html = `
    <div style="background-color: #0B0F17; font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; text-align: center; color: #F3F4F6;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 8px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <div style="margin-bottom: 35px; border-bottom: 1px solid #1F2937; padding-bottom: 20px;">
          <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; font-family: sans-serif;">V I N D E X</td>
              <td align="right"><span style="font-size: 11px; color: #9CA3AF; letter-spacing: 1px; font-family: monospace; background-color: #1F2937; padding: 4px 8px; border-radius: 4px;">SISTEMA ACTIVO</span></td>
            </tr>
          </table>
        </div>
        <p style="font-size: 14px; color: #9CA3AF; font-family: monospace; margin-bottom: 25px; margin-top: 0;">REGISTRO DE INGRESO // REF: ${requestID}</p>
        <p style="font-size: 16px; line-height: 1.6; color: #E5E7EB; margin-bottom: 20px;">Estimado/a <strong>${escapeHtml(payload.name)}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 18px;">Le confirmamos que los datos correspondientes a su escenario y el statu quo del conflicto han sido indexados correctamente en nuestra plataforma.</p>
        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 18px;">A partir de este momento, el caso ingresa formalmente en nuestra <strong>fase de análisis de admisión</strong>. Nuestro equipo evaluará detalladamente los elementos provistos para determinar la viabilidad de una intervención y proyectar la arquitectura de la estrategia jurídica adecuada.</p>
        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 35px;">Un analista especializado se pondrá en comunicación directa con usted a la brevedad, utilizando esta vía de contacto o el teléfono de enlace directo que ha registrado: <span style="color: #FFFFFF; font-weight: 600; font-family: monospace;">${escapeHtml(payload.phone)}</span>.</p>
        <div style="border-top: 1px solid #1F2937; padding-top: 25px; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
          <p style="margin: 0 0 5px 0; color: #F3F4F6; font-weight: bold;">Gabinete de Estrategia — VINDEX</p>
          <p style="margin: 0 0 15px 0;"><a href="https://vindexlegal.com.ar" style="color: #9CA3AF; text-decoration: none; border-bottom: 1px dashed #4B5563;">vindexlegal.com.ar</a></p>
          <p style="font-size: 11px; color: #6B7280; margin: 0; font-family: monospace; line-height: 1.4;">CONFIDENCIALIDAD: La información contenida en esta transmisión interna está sujeta a reserva estricta del protocolo de evaluación de admisión VINDEX.</p>
        </div>
      </div>
    </div>
  `

  const mailFrom = getEnv('MAIL_FROM')
  const transporter = getTransporter()

  await transporter.sendMail({
    from: mailFrom,
    to: payload.email,
    subject,
    text,
    html,
  })
}

// 3. ENTORNO TRIPLE DISPARO SECUENCIAL (Sincronizado)
async function sendWhatsAppNotification(payload: IntakePayload, requestID: string) {
  try {
    const phoneNumberID = getEnv('WA_PHONE_NUMBER_ID')
    const accessToken = getEnv('WA_ACCESS_TOKEN')
    const logoUrl = getEnv('WA_LOGO_URL')

    let cleanedPhone = payload.phone.replace(/\D/g, '')

    if (cleanedPhone.startsWith('5409')) {
      cleanedPhone = '549' + cleanedPhone.substring(4)
    } else if (cleanedPhone.startsWith('549')) {
      // Formato internacional correcto
    } else if (cleanedPhone.startsWith('11') || cleanedPhone.startsWith('34') || cleanedPhone.startsWith('26') || cleanedPhone.startsWith('35')) {
      cleanedPhone = '549' + cleanedPhone
    }

    // 🚀 MENSAJE 1: Saludo con logotipo + Código de Registro Estratégico
    const response1 = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanedPhone,
        type: "template",
        template: {
          name: "vindex_admision_v2_parte1",
          language: { code: "es_AR" },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: { link: logoUrl }
                }
              ]
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: payload.name },
                { type: "text", text: requestID }
              ]
            }
          ]
        }
      }),
    })

    if (!response1.ok) {
      const errData1 = await response1.json()
      console.error('Meta API rechazó la Parte 1:', errData1)
    }

    // 🚀 MENSAJE 2: Manifiesto y Quiebre de Simetría (Texto Puro)
    const response2 = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanedPhone,
        type: "template",
        template: {
          name: "vindex_admision_v2_parte2",
          language: { code: "es_AR" },
          components: []
        }
      }),
    })

    if (!response2.ok) {
      const errData2 = await response2.json()
      console.error('Meta API rechazó la Parte 2:', errData2)
    }

    // 🚀 MENSAJE 3: Protocolo de Confidencialidad + Cierre con Botón Web
    const response3 = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanedPhone,
        type: "template",
        template: {
          name: "vindex_admision_v2_parte3",
          language: { code: "es_AR" },
          components: []
        }
      }),
    })

    if (!response3.ok) {
      const errData3 = await response3.json()
      console.error('Meta API rechazó la Parte 3:', errData3)
    }

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

// 4. ENRUTADOR POST PRINCIPAL REFACtORIZADO
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

    // 🎯 VALIDACIÓN QUIRÚRGICA CON CAMPOS DE ELITE (ahora sí, del lado del servidor)
    const parsed = intakeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos. Revisá los campos del formulario.' },
        { status: 400 }
      )
    }

    const payload: IntakePayload = parsed.data

    const requestID = `VX-${Math.floor(1000 + Math.random() * 9000)}`

    await sendInstitutionalEmail(payload)
    await sendCourtesyEmail(payload, requestID)

    // Gatillo automático triple blindado
    await sendWhatsAppNotification(payload, requestID)

    return NextResponse.json({ ok: true, warnings: [] })
  } catch (error) {
    console.error('Error procesando intake:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo procesar la solicitud.' }, { status: 500 })
  }
}