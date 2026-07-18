import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 🔒 Oculta el header "X-Powered-By: Next.js" — no da ninguna ventaja
  // funcional y es información gratuita de más para quien esté buscando
  // vulnerabilidades conocidas de un framework específico.
  poweredByHeader: false,
};

export default nextConfig;