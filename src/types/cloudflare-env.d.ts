// Bindings propios del Worker (ver wrangler.jsonc). Se suman a la interfaz
// CloudflareEnv que declara OpenNext, para que getCloudflareContext().env
// los conozca con su tipo. El proyecto no instala @cloudflare/workers-types:
// acá se declara solo la parte de la API de KV que usa el sitio.
declare global {
  interface KvNamespaceBasico {
    get<T>(key: string, type: 'json'): Promise<T | null>
    put(key: string, value: string, options?: { expiration?: number }): Promise<void>
    delete(key: string): Promise<void>
    list(options: { prefix: string; limit?: number }): Promise<{ keys: { name: string; expiration?: number }[] }>
  }

  interface CloudflareEnv {
    /** Consultas cuyo correo al estudio falló; se reintentan cada 10 minutos. */
    CONSULTAS_PENDIENTES?: KvNamespaceBasico
  }
}

export {}
