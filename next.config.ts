import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 🔒 Oculta el header "X-Powered-By: Next.js" — no da ninguna ventaja
  // funcional y es información gratuita de más para quien esté buscando
  // vulnerabilidades conocidas de un framework específico.
  poweredByHeader: false,
  // 🔒 HSTS: le indica al navegador que, por los próximos 2 años, entre a
  // este dominio (y sus subdominios) solo por https, sin pasar nunca por
  // http. Va acá y no solo en public/_headers porque Cloudflare aplica
  // _headers únicamente a los archivos estáticos: las páginas las genera el
  // Worker y no reciben esas cabeceras. public/_headers lleva la misma
  // línea para cubrir imágenes, CSS y JS.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;