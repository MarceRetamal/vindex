// Punto de entrada del Worker en Cloudflare (ver "main" en wrangler.jsonc).
//
// Delega todas las visitas en el Worker que genera OpenNext
// (.open-next/worker.js, se arma en cada build) y le suma la tarea
// programada que reintenta las consultas cuyo correo al estudio falló.
//
// Este archivo no pasa por el chequeo de tipos de Next (está excluido en
// tsconfig.json) porque importa un archivo que solo existe después del build.

import { default as handler } from './.open-next/worker.js'

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js'

type Contexto = { waitUntil(promesa: Promise<unknown>): void }

const worker = {
  fetch: handler.fetch,

  // Cada 10 minutos (wrangler.jsonc → triggers.crons). El pedido es interno:
  // no viaja por internet y por eso no trae `cf`, que es lo que la ruta usa
  // para distinguirlo de un pedido externo.
  async scheduled(_controlador: unknown, env: unknown, ctx: Contexto) {
    const pedido = new Request('https://vindexlegal.com.ar/api/intake/reintentar', { method: 'POST' })
    ctx.waitUntil(
      handler.fetch(pedido, env, ctx).then(async (respuesta: Response) => {
        if (!respuesta.ok) console.error('Reintento de consultas: respuesta', respuesta.status, await respuesta.text())
      })
    )
  },
}

export default worker
