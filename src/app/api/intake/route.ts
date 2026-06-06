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

// =========================================================================
// 1. CORREO INSTITUCIONAL (El que te llega a vos)
// =========================================================================
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

// =========================================================================
// 2. NUEVO: CORREO DE CORTESÍA PREMIUM (El que le llega al cliente)
// =========================================================================
async function sendCourtesyEmail(payload: IntakePayload) {
  const subject = `NOTIFICACIÓN DE INGRESO: Protocolo de Evaluación — VINDEX`
  const requestID = `VX-${Math.floor(1000 + Math.random() * 9000)}`

  const text = `
SISTEMA VINDEX — CONFIRMACIÓN DE RECEPCIÓN
--------------------------------------------------
ID de Solicitud: ${requestID}
Destinatario: ${payload.name}

Se han recibido correctamente los parámetros del escenario provisto y la descripción del conflicto en nuestra plataforma.
El caso ingresó formalmente en fase de análisis técnico-legal para determinar su admisibilidad y viabilidad estratégica. 

VINDEX no procesa consultas automáticas. Un analista especializado evaluará el statu quo del escenario y se pondrá en contacto directo con usted a la brevedad a través de este medio o al teléfono provisto (${payload.phone || '-'}).

Atentamente,
Gabinete de Estrategia VINDEX
https://vindex.dpdns.org
--------------------------------------------------
Documento de transmisión interna. Por favor, no responda directamente a este correo automático.
`.trim()

  const html = `
    <div style="background-color: #0B0F17; font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; text-align: center; color: #F3F4F6;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 8px; padding: 40px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        
        <div style="margin-bottom: 35px; border-bottom: 1px solid #1F2937; padding-bottom: 20px;">
          <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; font-family: sans-serif;">V I N D E X</td>
              <td align="right">
                <span style="font-size: 11px; color: #9CA3AF; letter-spacing: 1px; font-family: monospace; background-color: #1F2937; padding: 4px 8px; border-radius: 4px;">SISTEMA ACTIVO</span>
              </td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #9CA3AF; font-family: monospace; margin-bottom: 25px; margin-top: 0;">
          REGISTRO DE INGRESO // REF: ${requestID}
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #E5E7EB; margin-bottom: 20px;">
          Estimado/a <strong>${escapeHtml(payload.name)}</strong>,
        </p>

        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 18px;">
          Le confirmamos que los datos correspondientes a su escenario y el statu quo del conflicto han sido indexados correctamente en nuestra plataforma.
        </p>

        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 18px;">
          A partir de este momento, el caso ingresa formalmente en nuestra <strong>fase de evaluación estricta</strong>. Nuestro equipo técnico y legal analizará los elementos provistos para determinar la admisibilidad de una intervención y proyectar la arquitectura de la estrategia jurídica adecuada.
        </p>

        <p style="font-size: 15px; line-height: 1.7; color: #D1D5DB; margin-bottom: 35px;">
          Un analista especializado se pondrá en comunicación directa con usted a la brevedad, utilizando esta vía de contacto o el teléfono de enlace directo que ha registrado: <span style="color: #FFFFFF; font-weight: 600; font-family: monospace;">${escapeHtml(payload.phone || '-')}</span>.
        </p>

        <div style="border-top: 1px solid #1F2937; padding-top: 25px; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
          <p style="margin: 0 0 5px 0; color: #F3F4F6; font-weight: bold;">Gabinete Técnico Legal — VINDEX</p>
          <p style="margin: 0 0 15px 0;"><a href="https://vindex.dpdns.org" style="color: #9CA3AF; text-decoration: none; border-bottom: 1px dashed #4B5563;">vindex.dpdns.org</a></p>
          
          <p style="font-size: 11px; color: #6B7280; margin: 0; font-family: monospace; line-height: 1.4;">
            CONFIDENCIALIDAD: La información contenida en esta transmisión interna está sujeta a reserva estricta del protocolo de evaluación VINDEX.
          </p>
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

// =========================================================================
// 3. ENRUTADOR POST PRINCIPAL
// =========================================================================
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

    // Ejecuta el envío interno para vos
    await sendInstitutionalEmail(payload)

    // AHORA SÍ: Ejecuta el envío de cortesía disruptivo para el cliente
    await sendCourtesyEmail(payload)

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