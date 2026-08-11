// Cliente mínimo de la API de WhatsApp Cloud (Meta Graph API) para enviar
// mensajes de texto y mensajes interactivos (botones y listas).

const GRAPH_VERSION = 'v21.0'

export type ListRow = { id: string; title: string; description?: string }
export type ListSection = { title: string; rows: ListRow[] }
export type ListMenu = {
  header?: string
  body: string
  footer?: string
  buttonLabel: string
  sections: ListSection[]
}
export type ReplyButtons = {
  body: string
  buttons: Array<{ id: string; title: string }>
}

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`)
  }
  return value
}

async function callGraphApi(body: Record<string, unknown>): Promise<void> {
  const phoneNumberId = getEnv('WA_PHONE_NUMBER_ID')
  const accessToken = getEnv('WA_ACCESS_TOKEN')

  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Meta Graph API rechazó el mensaje de WhatsApp:', response.status, errorBody)
  }
}

export async function sendText(to: string, body: string): Promise<void> {
  if (!body.trim()) return
  await callGraphApi({
    to,
    type: 'text',
    text: { body, preview_url: false },
  })
}

export async function sendListMenu(to: string, menu: ListMenu): Promise<void> {
  await callGraphApi({
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      ...(menu.header ? { header: { type: 'text', text: menu.header } } : {}),
      body: { text: menu.body },
      ...(menu.footer ? { footer: { text: menu.footer } } : {}),
      action: {
        button: menu.buttonLabel,
        sections: menu.sections.map((section) => ({
          title: section.title,
          rows: section.rows.map((row) => ({
            id: row.id,
            title: row.title,
            ...(row.description ? { description: row.description } : {}),
          })),
        })),
      },
    },
  })
}

export async function sendReplyButtons(to: string, menu: ReplyButtons): Promise<void> {
  await callGraphApi({
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: menu.body },
      action: {
        buttons: menu.buttons.map((button) => ({
          type: 'reply',
          reply: { id: button.id, title: button.title },
        })),
      },
    },
  })
}

export async function markAsRead(messageId: string): Promise<void> {
  await callGraphApi({
    status: 'read',
    message_id: messageId,
  })
}
