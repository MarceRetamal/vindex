// Este script corre DESPUÉS de "opennextjs-cloudflare build" (ver package.json).
// Copia las páginas ya armadas (como las notas del blog) a la carpeta de
// "archivos estáticos" del paquete final, que es el único lugar de donde
// Cloudflare Workers puede servir contenido sin depender de un disco.
//
// Está escrito en Node.js puro (sin comandos de terminal tipo "cp -r") para
// que funcione igual en Windows que en el servidor Linux de Cloudflare.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const CACHE_DIR = path.join(ROOT, '.open-next', 'cache')
const DEST_DIR = path.join(ROOT, '.open-next', 'assets', 'cdn-cgi', '_next_cache')

function copiarCarpeta(origen, destino) {
  if (!fs.existsSync(origen)) return 0
  fs.mkdirSync(destino, { recursive: true })
  let copiados = 0

  for (const entrada of fs.readdirSync(origen, { withFileTypes: true })) {
    const rutaOrigen = path.join(origen, entrada.name)
    const rutaDestino = path.join(destino, entrada.name)

    if (entrada.isDirectory()) {
      copiados += copiarCarpeta(rutaOrigen, rutaDestino)
    } else {
      fs.copyFileSync(rutaOrigen, rutaDestino)
      copiados += 1
    }
  }

  return copiados
}

if (!fs.existsSync(CACHE_DIR)) {
  console.warn('[copy-cache-assets] No se encontró .open-next/cache — ¿corriste "opennextjs-cloudflare build" antes?')
  process.exit(0)
}

const total = copiarCarpeta(CACHE_DIR, DEST_DIR)
console.log(`[copy-cache-assets] ${total} archivo(s) copiado(s) a .open-next/assets/cdn-cgi/_next_cache`)
