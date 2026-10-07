// Medición de conversiones del agente en Google Analytics 4 (Measurement
// Protocol). Es opcional: sin GA_API_SECRET no hace nada. No se envían datos
// personales: el identificador es un hash del teléfono con el secreto de la
// app como sal, y el evento solo lleva el área de la consulta.

const MEASUREMENT_ID = 'G-V20S3PF7YK'

async function pseudonymousClientId(phone: string): Promise<string> {
  const salt = process.env.WA_APP_SECRET ?? ''
  const data = new TextEncoder().encode(`${salt}:${phone}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `${hex.slice(0, 10)}.${hex.slice(10, 20)}`
}

export async function trackLead(phone: string, area: string): Promise<void> {
  const apiSecret = process.env.GA_API_SECRET
  if (!apiSecret) return

  const clientId = await pseudonymousClientId(phone)
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${encodeURIComponent(apiSecret)}`

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      events: [{ name: 'generate_lead', params: { form: 'whatsapp', source: 'whatsapp_agent', area: area || 'otro' } }],
    }),
  })
}
