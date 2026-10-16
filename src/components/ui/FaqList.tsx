export type FaqItem = { pregunta: string; respuesta: string }

/**
 * Preguntas frecuentes desplegables, con <details>/<summary> nativos:
 * funcionan con teclado y lector de pantalla sin JavaScript. El JSON-LD
 * correspondiente se arma aparte con `faqSchema()` (src/lib/schema.ts).
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null

  return (
    <div className="grid gap-4">
      {items.map((f) => (
        <details key={f.pregunta} className="glass group rounded-[24px] p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-bold text-white">
            {f.pregunta}
            <span aria-hidden="true" className="text-[var(--accent)] transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{f.respuesta}</p>
        </details>
      ))}
    </div>
  )
}
