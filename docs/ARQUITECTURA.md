# Arquitectura de vindexlegal.com.ar

Mapa del sistema, zonas críticas y deuda técnica conocida. Actualizado al 16/10/2026.

## 1. Vista general

Sitio Next.js 16 (App Router) que se publica como un Cloudflare Worker mediante OpenNext. Casi todo es estático: las 48 páginas se generan en el build y el Worker solo ejecuta código en tres lugares:

| Pieza | Runtime | Qué hace |
|---|---|---|
| `worker.ts` | Worker | Entrada del Worker: delega en OpenNext y corre la tarea programada (cada 10 min) que reenvía consultas pendientes. |
| `src/middleware.ts` | Edge | Redirige http → https en el dominio de producción y marca `noindex` las vistas previas `*.workers.dev`. |
| `src/app/api/intake/route.ts` | Node.js (`nodejs_compat`) | Recibe el formulario de consulta. |
| Páginas | Estáticas (SSG) | Se sirven desde el caché de assets (`staticAssetsIncrementalCache`). |

Deploy: cada merge a `main` dispara Workers Builds, que corre `npm run build:cloudflare`: `build-content` → `opennextjs-cloudflare build` → `copy-cache-assets`. `wrangler.jsonc` es la fuente de verdad del Worker.

## 2. Flujos de datos

### 2.1 Contenido (notas y tips)

```
src/content/blog/*.md ─┐
src/content/tips/*.md ─┼─ scripts/build-content.mjs ──► src/content/*.generated.json ──► src/lib/blog.ts, tips.ts
public/covers/<slug>.* ┘   (frontmatter, markdown → HTML,                                   │
                            índice, portada, faq)                                            ▼
                                                     páginas /blog/[slug], /tips/[slug], [area], sitemap, home
```

- El markdown se convierte una sola vez, en el build (`scripts/markdown.mjs`). El sitio nunca lee el disco, porque Workers no tiene uno.
- La relación nota ↔ área ↔ tips se hace por texto: `materia` de la nota = `materia` del área, y `categoria` del tip = `categoriaTips` del área (`src/data/areas.ts`).

### 2.2 Formulario de consulta

```
EvaluationForm (navegador) ── zod + Turnstile ──► POST /api/intake
   1. honeypot `website` → responde ok sin procesar
   2. límite por IP (5 por minuto)             ── excedido → 429
   3. verifica Turnstile (Cloudflare)          ── falla → 400; servicio caído → 503
   4. valida con zod                           ── falla → 400
   5. límite por teléfono (3 cada 24 h, KV)    ── excedido → 429
   6. correo al estudio (SMTP)                 ── falla → se guarda en KV y se reintenta cada 10 min
                                                  (si tampoco se puede guardar → 500)
   7. correo de cortesía a quien consulta      ┐ en segundo plano (ctx.waitUntil), después
   8. 3 plantillas de WhatsApp (Meta Graph)    ┘ de responder; si fallan, se registra
   9. { ok: true }
```

Los límites de intentos viven en `src/lib/intake/limite.ts` (el de IP usa el binding `INTAKE_LIMITER` de `wrangler.jsonc`; ambos se omiten fuera del Worker). La normalización del teléfono está en `src/lib/intake/telefono.ts`. Las opciones y los largos de los campos viven en `src/data/intake.ts` y los usan el formulario y el servidor.

### 2.3 SEO y datos estructurados

- Metadatos: `src/lib/metadata.ts` (`buildMetadata`) y `src/app/layout.tsx`.
- JSON-LD: todo sale de `src/lib/schema.ts` y se inserta con `src/components/seo/JsonLd.tsx`. Hay `LegalService` global, `Article` en notas y tips, `Service` y `FAQPage` en áreas, `FAQPage` en notas con `faq:` y `BreadcrumbList` en las migas de pan.
- `src/app/sitemap.ts`, `robots.ts`, `public/llms.txt`.

### 2.4 Datos del estudio

`src/data/site.ts` es la fuente única de la URL, el teléfono, el email, el WhatsApp y las redes. Lo usan el pie de página, el botón flotante, los metadatos, el JSON-LD, el sitemap y robots. `public/llms.txt` y los textos visibles de cada página se mantienen a mano.

## 3. Zonas críticas

Ordenadas por impacto en el negocio.

1. ~~**Normalización del teléfono para WhatsApp.**~~ Resuelto el 21/11/2026. `src/lib/intake/telefono.ts` agrega `549` a cualquier número argentino de 10 dígitos nacionales y quita el 0 y el 15 (`221 555 1234`, `0221 15 555 1234`, `+54 9 221 …`). Un número sin código de área o de otro país se envía tal cual y WhatsApp lo rechaza (queda en el registro del Worker).
2. **Versión de la API de Meta** (`v25.0`, fija en `route.ts`). Meta retira cada versión a los ~2 años (la v18.0 venció el 26/1/2026). Revisar el calendario en el Changelog de la Graph API y planificar la actualización antes del retiro.
3. ~~**La consulta no se guarda en ningún lado.**~~ Resuelto el 16/10/2026. Si el SMTP falla, la consulta se guarda en Cloudflare KV (`CONSULTAS_PENDIENTES`, `src/lib/intake/pendientes.ts`) y la tarea programada de `worker.ts` la reenvía cada 10 minutos con el asunto "[REENVÍO — recibida el …]". Se borra al entregarse y, como máximo, a los 30 días. Las consultas pendientes se pueden ver en el panel de Cloudflare → Storage & Databases → KV → `vindex-consultas-pendientes`.
4. ~~**Latencia del envío.**~~ Resuelto el 16/10/2026. La persona solo espera Turnstile y el correo al estudio (o su guardado en KV). La confirmación y los WhatsApp corren después con `ctx.waitUntil`. Con un SMTP de 2 s por mensaje, la respuesta bajó de 4,2 s a 2,1 s, sin contar las 3 llamadas a Meta que también dejaron de esperarse.
5. ~~**Validación del navegador más laxa que la del servidor.**~~ Resuelto: el formulario usa los mismos `LIMITES` que el servidor (`src/data/intake.ts`).
6. **Fechas del sitemap escritas a mano** (`lastModified` en `sitemap.ts`). Si se rediseña una página y no se actualiza su fecha, Google recibe una fecha vieja.
7. **Relación por texto entre notas, tips y áreas.** Un error de tipeo en `materia:` o `categoria:` hace desaparecer los enlaces relacionados sin ningún aviso en el build.
8. **Conversor de markdown propio.** No escapa comillas dentro de la URL de un enlace. El riesgo es bajo porque el contenido lo escribe solo el estudio, pero no conviene publicar contenido de terceros por esta vía.

## 4. Deuda de mantenimiento

| Tema | Detalle | Acción sugerida |
|---|---|---|
| `middleware.ts` | Next 16 lo marca como obsoleto en favor de `proxy.ts`, pero OpenNext todavía no soporta `proxy.ts`. | Migrar cuando OpenNext lo soporte. |
| Clases repetidas | La etiqueta chica en mayúsculas (`text-[11px] font-bold uppercase tracking-[0.22em]…`) y el cuerpo de artículo (blog y tips, con tamaños distintos) se repiten. | Extraer componentes cuando se toque ese diseño. |

## 5. Limpieza del 16/10/2026

Se borraron del repo:
- `.agents/` (1.399 archivos de skills de AWS ajenos al sitio), `skills-lock.json` y `vindex-clean.zip` (vacío);
- las secciones de la home sin uso (`Positioning`, `System`, `Differential`, `ClientProfile`) y `PageBlock`;
- las dependencias `gsap` y `@gsap/react`, que solo usaba `System`.

Todo queda en el historial de git.

## 6. Refactor aplicado el 16/10/2026 (sin cambios de funcionalidad)

- `src/data/site.ts`: `SITE_URL` y `contacto` reemplazan 12 copias de la URL y 3 del teléfono.
- `src/lib/schema.ts` y `src/components/seo/JsonLd.tsx`: un solo lugar para todo el JSON-LD. Escapa `<` en todos los bloques; antes solo lo hacía el FAQ de las notas.
- `sameAs` y `hasMap` se arman desde `redesSociales`.
- API de intake:
  - las 3 llamadas a WhatsApp, que eran un mismo bloque copiado tres veces, pasan a una función;
  - la normalización del teléfono queda en una función propia, verificada contra la versión anterior en 20.000 casos;
  - se abre una sola conexión SMTP por consulta en lugar de dos;
  - los largos de los campos se comparten con el formulario.
- `LinkList`: reemplaza 5 copias de la lista de enlaces relacionados.
- `FloatingWhatsApp`: toma el número de `site.ts` y envía el mismo evento a GA por `track()`.
- `ReadingProgress` deja de re-renderizar React en cada evento de scroll: un solo cálculo por cuadro.
- `HeroStage`: el ciclo de animación se detiene cuando el sello llega a su posición. Antes corría 60 veces por segundo aunque el mouse estuviera quieto.
- ESLint ignora `.open-next`, `.agents`, `.claude` y `design-system`: `npm run lint` pasó de 543 errores a 0.

Verificación:
- HTML visible y JSON-LD de las 48 páginas idénticos antes y después.
- Sitemap, robots y manifest idénticos byte a byte.
- API de intake: 12 escenarios comparados contra la versión anterior con servicios simulados, con las mismas llamadas, correos, mensajes y respuestas.
