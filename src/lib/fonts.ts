import { Lato } from 'next/font/google'

// Familia única de marca. Pesos recortados a los que realmente se usan
// (Black para headlines/wordmark, Bold para CTAs y sub-énfasis, Regular
// para cuerpo, Light + itálica para taglines/pull quotes) en vez de
// cargar la familia completa — cuida el peso de red y el CLS.
export const fontBody = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

// Misma instancia: font-heading (ver @theme en globals.css) reutiliza
// --font-body en vez de pedir la fuente dos veces.
export const fontHeading = fontBody
