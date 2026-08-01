import notasGeneradas from '@/content/blog.generated.json'

// Este archivo YA NO lee el disco. Toda la lectura de src/content/blog/*.md
// ocurre una sola vez, en el momento del build, a cargo de
// scripts/build-content.mjs — acá solo se importa el resultado ya
// procesado (src/content/blog.generated.json) como si fuera código común.
//
// Por qué el cambio: leer archivos con `fs` funciona perfecto durante el
// build, pero algunos entornos de despliegue (como el que ejecuta este
// sitio) no tienen acceso a un disco real en el momento de responder cada
// visita. Un JSON importado no tiene ese problema: ya está resuelto de
// antemano y viaja empaquetado junto con el resto del código.

export type Heading = { id: string; texto: string }

export type Nota = {
  slug: string
  titulo: string
  descripcion: string
  copete: string
  materia: string
  fecha: string
  actualizado: string
  minutos: number
  resumen: string[]
}

export type NotaCompleta = Nota & { html: string; headings: Heading[] }

type NotaGenerada = NotaCompleta

const TODAS_LAS_NOTAS = notasGeneradas as NotaGenerada[]

export function obtenerNotas(): Nota[] {
  return TODAS_LAS_NOTAS.map(({ html: _html, headings: _headings, ...resto }) => resto)
}

export function obtenerNota(slug: string): NotaCompleta | undefined {
  return TODAS_LAS_NOTAS.find((n) => n.slug === slug)
}

export function formatearFecha(iso: string): string {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
