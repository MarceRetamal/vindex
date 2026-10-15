import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 🔒 REDIRECCIÓN HTTP → HTTPS (301), como red de seguridad.
//
// La primera línea de defensa es la opción "Always Use HTTPS" de Cloudflare
// (panel de la zona → SSL/TLS → Edge Certificates). Esto existe para que el
// sitio no dependa solo de un interruptor del panel que alguien puede apagar.
//
// Por qué middleware.ts y no proxy.ts: en Next 16 "middleware" está marcado
// como obsoleto y se renombró "proxy", pero proxy.ts corre siempre en el
// runtime de Node.js y OpenNext para Cloudflare todavía no lo soporta (el
// build se corta con "Node.js middleware is not currently supported").
// middleware.ts sigue corriendo en el runtime Edge, que sí funciona en el
// Worker. Cuando OpenNext soporte proxy.ts, se puede migrar.
//
// Sin bucles: Cloudflare informa en cada pedido con qué protocolo llegó el
// visitante (cabecera x-forwarded-proto y la propia URL del pedido). Después
// del 301 el navegador vuelve por https, la condición deja de cumplirse y el
// pedido sigue de largo.
//
// Solo actúa sobre el dominio de producción: en "npm run dev" o en el
// preview local (http://localhost) no hace nada.

const HOSTS_PRODUCCION = new Set(['vindexlegal.com.ar', 'www.vindexlegal.com.ar'])

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? request.nextUrl.hostname).split(':')[0].toLowerCase()
  if (!HOSTS_PRODUCCION.has(host)) return NextResponse.next()

  const protocolo =
    request.headers.get('x-forwarded-proto')?.split(',')[0].trim().toLowerCase() ??
    request.nextUrl.protocol.replace(':', '')

  if (protocolo !== 'http') return NextResponse.next()

  const destino = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${host}`)
  return NextResponse.redirect(destino, 301)
}

export const config = {
  // Los archivos estáticos (/_next/static, imágenes de /public, etc.) los
  // sirve Cloudflare directamente sin pasar por el Worker, así que para
  // ellos manda "Always Use HTTPS" del panel. Se excluyen acá para no
  // ejecutar código de más.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
}
