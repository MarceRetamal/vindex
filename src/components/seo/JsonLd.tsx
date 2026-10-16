// Inserta datos estructurados (Schema.org) como JSON-LD. No muestra nada en
// pantalla. Escapa "<" para que un texto con "</script>" no pueda cortar la
// etiqueta: el resultado es el mismo JSON para Google, pero seguro.

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
