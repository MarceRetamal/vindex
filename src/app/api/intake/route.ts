import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type IntakePayload = {
  name: string
  email: string
  phone?: string
  locality?: string
  province?: string
  status?: string
  urgency?: string
  message: string
  website?: string
}

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

async function sendInstitutionalEmail(payload: IntakePayload) {
  const subject = `[VINDEX] Nueva evaluación jurídica — ${payload.name}`

  const text = `
Nuevo potencial cliente recibido desde vindex.website

Nombre: ${payload.name}
Email: ${payload.email}
Teléfono: ${payload.phone || '-'}
Localidad: ${payload.locality || '-'}
Provincia: ${payload.province || '-'}
Estado actual: ${payload.status || '-'}
Urgencia: ${payload.urgency || '-'}

Mensaje:
${payload.message}
`.trim()

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Nueva evaluación jurídica recibida desde vindex.website</h2>

      <p><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(payload.phone || '-')}</p>
      <p><strong>Localidad:</strong> ${escapeHtml(payload.locality || '-')}</p>
      <p><strong>Provincia:</strong> ${escapeHtml(payload.province || '-')}</p>
      <p><strong>Estado actual:</strong> ${escapeHtml(payload.status || '-')}</p>
      <p><strong>Urgencia:</strong> ${escapeHtml(payload.urgency || '-')}</p>

      <hr />

      <p><strong>Mensaje:</strong></p>
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<IntakePayload>

    const payload: IntakePayload = {
      name: String(body.name ?? '').trim(),
      email: String(body.email ?? '').trim(),
      phone: String(body.phone ?? '').trim(),
      locality: String(body.locality ?? '').trim(),
      province: String(body.province ?? '').trim(),
      status: String(body.status ?? '').trim(),
      urgency: String(body.urgency ?? '').trim(),
      message: String(body.message ?? '').trim(),
      website: String(body.website ?? '').trim(),
    }

    if (payload.website) {
      return NextResponse.json({ ok: true, warnings: [] })
    }

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.locality ||
      !payload.province ||
      !payload.message
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Faltan campos obligatorios.',
        },
        { status: 400 }
      )
    }

    await sendInstitutionalEmail(payload)

    return NextResponse.json({
      ok: true,
      warnings: [],
    })
  } catch (error) {
    console.error('Error procesando intake:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'No se pudo procesar la solicitud.',
      },
      { status: 500 }
    )
  }
}