# Arquitectura de vindexlegal.com.ar

Mapa del sistema, zonas críticas y deuda técnica conocida. Actualizado al 16/10/2026.

## 1. Vista general

Sitio Next.js 16 (App Router) que se publica como un Cloudflare Worker mediante OpenNext. Casi todo es estático: las 48 páginas se generan en el build y el Worker solo ejecuta código en tres lugares:

| Pieza | Runtime | Qué hace |
|---|---|---|
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
   2. verifica Turnstile (Cloudflare)          ── falla → 400
   3. valida con zod                           ── falla → 400
   4. correo al estudio (SMTP)                 ── falla → 500 (la consulta NO queda guardada)
   5. correo de cortesía a quien consulta      ── falla → se registra y sigue
   6. 3 plantillas de WhatsApp (Meta Graph)    ── falla → se registra y sigue
   7. { ok: true }
```

Las opciones y los largos de los campos viven en `src/data/intake.ts` y los usan el formulario y el servidor.

### 2.3 SEO y datos estructurados

- Metadatos: `src/lib/metadata.ts` (`buildMetadata`) y `src/app/layout.tsx`.
- JSON-LD: todo sale de `src/lib/schema.ts` y se inserta con `src/components/seo/JsonLd.tsx`. Hay `LegalService` global, `Article` en notas y tips, `Service` y `FAQPage` en áreas, `FAQPage` en notas con `faq:` y `BreadcrumbList` en las migas de pan.
- `src/app/sitemap.ts`, `robots.ts`, `public/llms.txt`.

### 2.4 Datos del estudio

`src/data/site.ts` es la fuente única de la URL, el teléfono, el email, el WhatsApp y las redes. Lo usan el pie de página, el botón flotante, los metadatos, el JSON-LD, el sitemap y robots. `public/llms.txt` y los textos visibles de cada página se mantienen a mano.

## 3. Zonas críticas

Ordenadas por impacto en el negocio.

1. **Normalización del teléfono para WhatsApp** (`normalizarTelefonoWhatsApp`, API de intake). Solo agrega `549` a los números que empiezan con 11, 34, 26 o 35.
   - Un número de La Plata cargado como `221 555 1234` se envía como `2215551234`, que la API interpreta como prefijo internacional 221 (Senegal).
   - Uno cargado como `0221 15 ...` se envía con el 0.
   - En los dos casos el mensaje no llega y el error solo queda en el registro del Worker.
   - Corregirlo cambia a quién le llega el mensaje, así que queda para una decisión aparte.
2. **Versión de la API de Meta** (`v18.0`, fija en el código). Meta retira las versiones viejas de la Graph API. Hay que verificar en el panel de Meta que siga activa y planificar la actualización.
3. **La consulta no se guarda en ningún lado.** Si el SMTP falla, la persona ve un error y la consulta se pierde. No hay cola ni almacenamiento de respaldo.
4. **Latencia del envío.** La persona espera, en serie, la verificación de Turnstile, 1 o 2 correos y 3 llamadas a Meta antes de ver "Consulta recibida". Las tareas secundarias (cortesía y WhatsApp) podrían ir en segundo plano con `ctx.waitUntil` del Worker. Eso cambia la secuencia y queda para una decisión aparte.
5. **Validación del navegador más laxa que la del servidor.**
   - El formulario no limita el largo del nombre (120), el teléfono (30) ni el email (200).
   - Si alguien los supera, recibe el error genérico "Datos inválidos" en lugar de un mensaje en el campo.
6. **Fechas del sitemap escritas a mano** (`lastModified` en `sitemap.ts`). Si se rediseña una página y no se actualiza su fecha, Google recibe una fecha vieja.
7. **Relación por texto entre notas, tips y áreas.** Un error de tipeo en `materia:` o `categoria:` hace desaparecer los enlaces relacionados sin ningún aviso en el build.
8. **Conversor de markdown propio.** No escapa comillas dentro de la URL de un enlace. El riesgo es bajo porque el contenido lo escribe solo el estudio, pero no conviene publicar contenido de terceros por esta vía.

## 4. Deuda de mantenimiento

| Tema | Detalle | Acción sugerida |
|---|---|---|
| Material ajeno en el repo | `.agents/` (≈1.400 archivos, 18 MB de skills de AWS), `skills-lock.json` y `vindex-clean.zip` (vacío). | Quitarlos del repo. |
| Código muerto | `Positioning`, `System`, `Differential` y `ClientProfile` (home) y `PageBlock`. `gsap` y `@gsap/react` solo los usa `System`. La UI de "Observaciones" del formulario nunca se muestra, porque la API siempre devuelve `warnings: []`. | Borrar con aprobación; quedan en el historial de git. |
| `middleware.ts` | Next 16 lo marca como obsoleto en favor de `proxy.ts`, pero OpenNext todavía no soporta `proxy.ts`. | Migrar cuando OpenNext lo soporte. |
| `<img>` en `/direccion` | Único aviso de lint. | Evaluar `next/image` con loader de Cloudflare sin tocar el diseño. |
| Clases repetidas | La etiqueta chica en mayúsculas (`text-[11px] font-bold uppercase tracking-[0.22em]…`) y el cuerpo de artículo (blog y tips, con tamaños distintos) se repiten. | Extraer componentes cuando se toque ese diseño. |

## 5. Refactor aplicado el 16/10/2026 (sin cambios de funcionalidad)

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
