// Correos del formulario de consulta: el aviso al estudio y la confirmación
// a quien consulta. Los usan /api/intake (envío normal) y
// /api/intake/reintentar (reenvío de consultas que quedaron pendientes).

import nodemailer from 'nodemailer'
import { AREA_LABELS, URGENCIA_LABELS, type AreaValue, type UrgenciaValue } from '@/data/intake'

export type IntakePayload = {
  name: string
  phone: string
  email?: string
  localidad?: string
  area: AreaValue
  urgency: UrgenciaValue
  message: string
  website?: string
}

export function getEnv(name: string): string {
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

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export type Transporter = ReturnType<typeof nodemailer.createTransport>

export function getTransporter(): Transporter {
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
export async function sendInstitutionalEmail(
  transporter: Transporter,
  payload: IntakePayload,
  /** Solo en reenvíos: cuándo llegó la consulta (texto ya formateado). */
  opciones: { recibidaEl?: string } = {}
) {
  const areaLabel = AREA_LABELS[payload.area]
  const urgencyLabel = URGENCIA_LABELS[payload.urgency]
  const localidad = payload.localidad?.trim() || 'No indicó'
  const email = payload.email?.trim() || 'No dejó email'

  const reenvio = opciones.recibidaEl ? ` [REENVÍO — recibida el ${opciones.recibidaEl}]` : ''
  const subject = `[VINDEX LEGAL] Nueva consulta — ${areaLabel} — ${payload.name}${reenvio}`
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
export async function sendCourtesyEmail(transporter: Transporter, payload: IntakePayload, requestID: string) {
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
