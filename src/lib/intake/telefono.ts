// Lleva el teléfono que escribió la persona al formato internacional que pide
// la API de WhatsApp para Argentina (549 + código de área + número, sin 0 ni 15).
//
// Cubre: 221 555 1234, 0221 15 555 1234, 221 15 555 1234, +54 9 221 555 1234,
// 54 221 555 1234 y 011 15 5555 1234. Un número que no tiene 10 dígitos
// nacionales (sin código de área, o de otro país) se devuelve tal cual, solo
// con dígitos: WhatsApp lo rechaza y queda registrado, en lugar de adivinar
// a quién se le escribe.

export function normalizarTelefonoWhatsApp(telefono: string): string {
  const digitos = telefono.replace(/\D/g, '')
  const original = digitos.startsWith('00') ? digitos.slice(2) : digitos

  let nacional = original
  const conPais = original.startsWith('54')
  if (conPais) nacional = original.slice(2)

  if (nacional.startsWith('0')) nacional = nacional.slice(1)
  // 9 de móvil: +54 9 ... (11 dígitos con el 9). Sin código de país no se toca.
  if (conPais && nacional.startsWith('9') && nacional.length === 11) nacional = nacional.slice(1)

  // El 15 de los celulares va después del código de área (2, 3 o 4 dígitos);
  // con él, el número nacional tiene 12 dígitos en lugar de 10.
  if (nacional.length === 12) {
    for (const largoArea of [2, 3, 4]) {
      if (nacional.slice(largoArea, largoArea + 2) === '15') {
        nacional = nacional.slice(0, largoArea) + nacional.slice(largoArea + 2)
        break
      }
    }
  }

  return nacional.length === 10 ? `549${nacional}` : original
}
