export const siteConfig = {
  name: 'VINDEX LEGAL',
  claim: 'Estudio jurídico en La Plata para personas y familias.',
  cta: {
    label: 'Contar mi caso',
    href: '/evaluacion',
  },
  // Número de WhatsApp en formato internacional, sin "+" ni espacios
  // (ejemplo: '5492211234567'). Mientras esté vacío NO se muestra ningún
  // botón ni enlace de WhatsApp en el sitio.
  whatsapp: '',
}

export function whatsappUrl(texto = 'Hola, quiero consultar por un caso.'): string {
  if (!siteConfig.whatsapp) return ''
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(texto)}`
}
