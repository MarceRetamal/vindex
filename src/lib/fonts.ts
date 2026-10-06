import { Lato } from 'next/font/google'

// Familia única de marca. Pesos recortados a los que realmente se usan
// (Black para headlines/wordmark, Bold para CTAs y sub-énfasis, Regular
// para cuerpo, Light para taglines) en vez de cargar la familia completa.
// La cursiva solo se usa en el cuerpo de los artículos (peso 400), así que
// va en una instancia aparte, sin precarga: antes se precargaban 4 archivos
// de cursiva en todas las páginas aunque casi ninguna los usa.
export const fontBody = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal'],
  variable: '--font-body',
  display: 'swap',
})

export const fontItalic = Lato({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-body-italic',
  display: 'swap',
  preload: false,
})

// Misma instancia: font-heading (ver @theme en globals.css) reutiliza
// --font-body en vez de pedir la fuente dos veces.
export const fontHeading = fontBody
