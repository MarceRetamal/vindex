import type { PreguntaFrecuente } from '@/lib/blog'
import { faqSchema } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'

// Datos estructurados FAQPage (Schema.org) para una nota del blog.
// No muestra nada en pantalla: solo agrega el JSON-LD si la nota trae el
// campo opcional `faq:` en su frontmatter. Si no lo trae, no renderiza nada.
//
// Regla de Google: cada pregunta y respuesta tiene que estar también visible
// en el texto de la nota (por ejemplo, en una sección "Preguntas frecuentes").
// Marcar preguntas que el lector no puede ver en la página es contrario a
// sus pautas de datos estructurados.

export function FaqSchema({ faq, url }: { faq?: PreguntaFrecuente[]; url: string }) {
  if (!faq || faq.length === 0) return null

  return <JsonLd data={faqSchema(faq, { id: `${url}#faq` })} />
}
