export const siteConfig = {
  name: 'VINDEX LEGAL',
  claim: 'Estudio jurídico en La Plata para personas y familias.',
  cta: {
    label: 'Contar mi caso',
    href: '/evaluacion',
  },
  // Número de WhatsApp Business en formato internacional, sin "+" ni espacios.
  // Es el número del asistente virtual (ver src/lib/whatsapp). Si se deja vacío
  // NO se muestra ningún botón ni enlace de WhatsApp en el sitio.
  whatsapp: '5491141743745',
}

export function whatsappUrl(texto = 'Hola, quiero consultar por un caso.'): string {
  if (!siteConfig.whatsapp) return ''
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(texto)}`
}
