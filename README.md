# VINDEX LEGAL — vindexlegal.com.ar

Sitio del estudio jurídico VINDEX LEGAL (La Plata). Next.js desplegado como Cloudflare Worker mediante [OpenNext](https://opennext.js.org/cloudflare).

## Cómo se publica

El deploy es automático: cada commit que llega a la rama `main` dispara la integración de Git de Cloudflare, que construye y publica el sitio. No hace falta (ni conviene) correr `npm run deploy` a mano.

La configuración del Worker vive en `wrangler.jsonc`, que es la fuente de verdad. Lo que se configura en el panel de Cloudflare y no en el repo:

- SSL/TLS → Edge Certificates → **Always Use HTTPS** (activado). El sitio además redirige http → https desde `src/middleware.ts`, como respaldo.
- Las variables secretas del formulario de contacto (contraseña SMTP).

## Contenido

No hace falta tocar código para publicar contenido:

- **Notas del blog:** un archivo `.md` por nota en `src/content/blog/`. La plantilla con todas las instrucciones está en `src/content/blog/_PLANTILLA.txt`. Con `borrador: "si"` la nota no se publica.
- **Tips:** un archivo `.md` por tip en `src/content/tips/`. El campo opcional `nota_pilar` enlaza el tip con su nota del blog.
- **Portadas:** `public/covers/<slug-de-la-nota>.svg` (o `.webp` / `.jpg`), se asignan solas por nombre.

El listado del blog, las páginas, el sitemap y los datos estructurados se generan solos en cada build (`scripts/build-content.mjs`).

## Desarrollo local

```bash
npm install
npm run dev               # servidor de desarrollo en http://localhost:3000
npm run build:cloudflare  # build completo del Worker, igual al de producción
npm run preview           # build + Worker local para probar antes de publicar
```

## Archivos clave

- `src/lib/schema.ts` — todos los datos estructurados (JSON-LD) del sitio.
- `src/app/sitemap.ts` — sitemap; las fechas de notas y tips salen de su campo `actualizado`.
- `public/llms.txt` — resumen del estudio para modelos de IA.
- `public/_headers` — cabeceras de los archivos estáticos (las páginas toman las suyas de `next.config.ts`).
- `src/data/site.ts` — URL, teléfono, email, WhatsApp y redes del estudio (fuente única).
- `docs/ARQUITECTURA.md` — mapa del sistema, flujos de datos, zonas críticas y deuda técnica.
- `docs/COMPONENTES.md` — sistema de componentes: catálogo, props, ejemplos y buenas prácticas.
