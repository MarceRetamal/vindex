/**
 * Slots de texto para piezas de diseño nuevas del rediseño premium.
 *
 * Estos arrays/strings son contenido, no diseño: los completa o edita
 * quien redacta la copy del sitio, nunca el código de los componentes.
 * Un componente que lee de acá debe verse completo con el slot vacío
 * (sin placeholder, sin "lorem ipsum") y solo agregar/quitar elementos
 * visuales a medida que el slot se llena.
 */

/** Eyebrow opcional sobre la V de partículas del hero. Vacío = no se renderiza. */
export const heroEyebrow: string = ''

/**
 * Fragmentos flotantes tipo "vidrio" alrededor de la V del hero, como si
 * se estuviera leyendo un expediente mientras la V se arma. Pensados para
 * 4 a 6 labels de 2 a 4 palabras. El primer valor es el texto que ya
 * existía en la tarjeta flotante del hero anterior (HeroVisual.tsx) —
 * se reubica tal cual, sin cambiar una palabra.
 */
export const heroFragments: string[] = [
  'La superioridad estructural no se improvisa. Se diseña.',
]
