// Fuente única de los datos del estudio que se repiten en el código (URL,
// teléfono, email, redes). Si cambia alguno, se cambia acá y se actualiza en
// todo el sitio: metadatos, datos estructurados, sitemap, pie de página y
// botón de WhatsApp. Los textos visibles de cada página no salen de acá.

export const SITE_URL = 'https://vindexlegal.com.ar'

export const contacto = {
  /** Formato internacional, para enlaces tel: y datos estructurados. */
  telefono: '+5491141743745',
  /** Como se muestra en pantalla. */
  telefonoVisible: '+54 9 11 4174-3745',
  email: 'info@vindexlegal.com.ar',
}

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
  whatsapp: '5491141743745',
}

export function whatsappUrl(texto = 'Hola, quiero consultar por un caso.'): string {
  if (!siteConfig.whatsapp) return ''
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(texto)}`
}

// Perfiles oficiales del estudio. Se muestran como íconos en el pie de página
// y en el menú móvil, y alimentan `sameAs` en src/lib/schema.ts.
export const redesSociales = [
  { red: 'instagram', nombre: 'Instagram', href: 'https://www.instagram.com/vindexlegal.ar/' },
  { red: 'facebook', nombre: 'Facebook', href: 'https://www.facebook.com/vindexleg' },
  { red: 'linkedin', nombre: 'LinkedIn', href: 'https://www.linkedin.com/in/vindex-legal' },
  { red: 'google', nombre: 'Google Maps', href: 'https://maps.google.com/?cid=11063836089595176365' },
] as const
