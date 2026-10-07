import nodemailer from 'nodemailer'
import { AREA_LABELS, URGENCIA_LABELS, type UrgenciaValue } from '@/data/intake'
import type { ContactProfile, UrgencyLevel } from './types'

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

// Misma estructura que el correo del formulario del sitio (/api/intake), para
// que el estudio reciba todas las consultas con el mismo formato y pueda
// compararlas. El teléfono es el número desde el que escribió la persona.
const URGENCIA_A_FORMULARIO: Record<UrgencyLevel, UrgenciaValue> = {
  urgente: 'urgente',
  alta: 'notificado',
  media: 'reciente',
  baja: 'antiguo',
}

export async function sendLeadEmail(params: { phone: string; profile: ContactProfile }): Promise<void> {
  const { phone, profile } = params
  const areaLabel = AREA_LABELS[profile.area || 'otro']
  const urgencyLabel = URGENCIA_LABELS[URGENCIA_A_FORMULARIO[profile.urgency]]
  const name = profile.name || 'Sin nombre'
  const email = profile.email || 'No dejó email'
  const localidad = profile.localidad || 'No indicó'
  const telefono = `+${phone}`
  const cuenta = profile.notes || '(sin resumen)'

  const subject = `[VINDEX LEGAL] Nueva consulta (WhatsApp) — ${areaLabel} — ${name}`
  const text = `Nueva consulta recibida por el asistente de WhatsApp\n\nNombre: ${name}\nTeléfono: ${telefono}\nEmail: ${email}\nLocalidad: ${localidad}\nTema: ${areaLabel}\nUrgencia: ${urgencyLabel}\n\nQué cuenta:\n${cuenta}\n\nCanal: WhatsApp (asistente virtual con IA). Se le informó que el estudio responde dentro de las 24 horas hábiles.`

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Nueva consulta recibida por el asistente de WhatsApp</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Localidad:</strong> ${escapeHtml(localidad)}</p>
      <p><strong>Tema:</strong> ${escapeHtml(areaLabel)}</p>
      <p><strong>Urgencia:</strong> ${escapeHtml(urgencyLabel)}</p>
      <hr />
      <p><strong>Qué cuenta:</strong></p>
      <p>${escapeHtml(cuenta).replace(/\n/g, '<br />')}</p>
      <hr />
      <p style="font-size: 12px; color: #555;">Canal: WhatsApp (asistente virtual con IA). Se le informó que el estudio responde dentro de las 24 horas hábiles.</p>
    </div>
  `

  const transporter = nodemailer.createTransport({
    host: getEnv('SMTP_HOST'),
    port: Number(getEnv('SMTP_PORT')),
    secure: (process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',
    auth: { user: getEnv('SMTP_USER'), pass: getEnv('SMTP_PASS') },
  })

  await transporter.sendMail({
    from: getEnv('MAIL_FROM'),
    to: getEnv('MAIL_TO'),
    ...(profile.email ? { replyTo: profile.email } : {}),
    subject,
    text,
    html,
  })
}
