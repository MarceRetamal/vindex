import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 🔒 Oculta el header "X-Powered-By: Next.js" — no da ninguna ventaja
  // funcional y es información gratuita de más para quien esté buscando
  // vulnerabilidades conocidas de un framework específico.
  poweredByHeader: false,
};

// Simula los bindings de Cloudflare (como el KV del agente de WhatsApp)
// cuando se corre `next dev` localmente.
initOpenNextCloudflareForDev();

export default nextConfig;