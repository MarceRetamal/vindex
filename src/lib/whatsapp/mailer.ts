import nodemailer from 'nodemailer'
import type { ContactProfile } from './types'

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`)
  }
  return value
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Notifica por correo al estudio cuando el agente de WhatsApp decide que
// un contacto necesita atención humana (urgencias, derivaciones pedidas
// explícitamente, o casos que superan lo que puede resolver el asistente).
export async function sendEscalationEmail(params: {
  phone: string
  profile: ContactProfile
  reason: string
}): Promise<void> {
  const smtpHost = getEnv('SMTP_HOST')
  const smtpPort = Number(getEnv('SMTP_PORT'))
  const smtpSecure = (process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true'
  const smtpUser = getEnv('SMTP_USER')
  const smtpPass = getEnv('SMTP_PASS')
  const mailFrom = getEnv('MAIL_FROM')
  const mailTo = getEnv('MAIL_TO')

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  })

  const urgencyLabel = params.profile.urgency === 'urgente' ? '🔴 URGENTE' : params.profile.urgency

  const subject = `[VINDEX LEGAL · WhatsApp] Derivación a humano — ${params.profile.name || params.phone}`
  const text = [
    `Un contacto de WhatsApp requiere atención humana.`,
    ``,
    `Teléfono: ${params.phone}`,
    `Nombre: ${params.profile.name || '(no informado)'}`,
    `Área de interés: ${params.profile.areaOfInterest || '(sin definir)'}`,
    `Urgencia: ${urgencyLabel}`,
    `Motivo de la derivación: ${params.reason}`,
    `Notas acumuladas: ${params.profile.notes || '(sin notas)'}`,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Derivación desde el asistente de WhatsApp</h2>
      <p><strong>Teléfono:</strong> ${escapeHtml(params.phone)}</p>
      <p><strong>Nombre:</strong> ${escapeHtml(params.profile.name || '(no informado)')}</p>
      <p><strong>Área de interés:</strong> ${escapeHtml(params.profile.areaOfInterest || '(sin definir)')}</p>
      <p><strong>Urgencia:</strong> ${escapeHtml(urgencyLabel)}</p>
      <p><strong>Motivo de la derivación:</strong> ${escapeHtml(params.reason)}</p>
      <hr />
      <p><strong>Notas acumuladas:</strong></p>
      <p>${escapeHtml(params.profile.notes || '(sin notas)')}</p>
    </div>
  `

  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    subject,
    text,
    html,
  })
}
