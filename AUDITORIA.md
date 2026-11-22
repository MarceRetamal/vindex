# AUDITORIA — vindex (2026-11-21)

Solo auditoría: no se modificó código. Único efecto colateral: `npm ci` (creó `node_modules/`, ignorado por git) y `npm run build` (regeneró `src/content/*.generated.json` y `.next/`). `git status` quedó limpio después.

Leyenda: **VERIFICADO** = lo probé con el comando/línea indicado. **INFERIDO** = deducción por lectura, no comprobada en ejecución.

## Checks reales

| Check | Resultado | Estado |
|---|---|---|
| `npx tsc --noEmit` | 0 errores (después de generar contenido). Antes de `build-content` falla con TS2307 por `blog.generated.json` / `tips.generated.json` ausentes: es esperado, están generados | VERIFICADO |
| `npx eslint` | 0 errores, 1 warning (`@next/next/no-img-element`, `direccion/page.tsx:44`) | VERIFICADO |
| `npm run build` | Compila, 50/50 páginas estáticas, sin errores ni warnings | VERIFICADO |
| `npm run build:cloudflare` / `preview` | No ejecutado (requiere OpenNext/wrangler, puede tocar cuenta Cloudflare). No se pudo comprobar | NO COMPROBADO |
| Tests automatizados | No existen tests propios del sitio (`git ls-files` sin `*.test/*.spec` fuera de `.claude/`); `package.json` no tiene script `test` | VERIFICADO |

## Hallazgos

| Prioridad | Archivo:línea | Hallazgo | Evidencia | Esfuerzo | Estado |
|---|---|---|---|---|---|
| Alta | `src/app/api/intake/route.ts:141-215` | Sin límite de intentos propio por IP/teléfono. Cada POST válido envía mail al estudio + mail de cortesía + 3 plantillas de WhatsApp a un número arbitrario. Única barrera: Turnstile + honeypot. Vector de abuso/costo (WhatsApp a terceros) si se resuelve el captcha o hay granjas de tokens | `grep -nE "rate\|limit" wrangler.jsonc worker.ts src/app/api` → sin resultados; no hay binding de rate limiting | M | VERIFICADO (ausencia). Impacto real: INFERIDO |
| Alta | `src/app/api/intake/route.ts:42-48` | Normalización de teléfono para WhatsApp solo reconoce prefijos 11/34/26/35: un `221…` (La Plata, el mercado del estudio) o `0221 15…` se envía sin `549` y el mensaje no llega. Ya figura como riesgo #1 en `docs/ARQUITECTURA.md:62-67`, sigue sin resolver | Lectura del código | S | VERIFICADO (código); consecuencia (no llega) INFERIDA por lo que dice el doc |
| Media | `src/app/api/intake/route.ts:75` | `await response.json()` sin try/catch en la rama de error de Meta: si Meta responde con cuerpo no-JSON, lanza y se cae al catch de `sendWhatsAppNotification` (se pierden las partes 2 y 3). Además `errData` se loguea completo (puede incluir el teléfono del consultante) | Línea 75-76 | S | VERIFICADO (código); datos personales en el log: INFERIDO |
| Media | `src/app/api/intake/route.ts:135` | `response.json()` de Turnstile sin try/catch ni chequeo de `response.ok`; un error de red/HTML del servicio devuelve 500 genérico (cae en el catch de la línea 211) en lugar de un error controlado | Línea 135 | S | VERIFICADO |
| Media | `src/app/api/intake/route.ts:179` | `requestID = VX-` + `Math.random()` de 5 dígitos (90.000 valores): colisiones probables con volumen y la clave KV (`pendientes.ts:41`) mezcla fecha, por lo que no hay pisado, pero el ID mostrado al cliente no es único | Línea 179 | S | VERIFICADO (código); colisión: INFERIDO |
| Media | `src/app/api/intake/route.ts:142` | `request.json()` sin límite de tamaño previo; el tope de `mensajeMax` se valida recién después de verificar Turnstile y parsear. Cuerpo enorme se parsea completo | Línea 142 | S | INFERIDO |
| Media | `docs/ARQUITECTURA.md:68` | Doc desactualizado: dice que la API de Meta está en `v18.0`; el código usa `v25.0` (`route.ts:35`) y el comentario `route.ts:33` dice que v18.0 ya venció | `grep -n "v18\|v25" docs/*.md src/app/api/intake/route.ts` | S | VERIFICADO |
| Media | `docs/ARQUITECTURA.md:~72` (riesgo #5) | Doc desactualizado: dice que el formulario no limita largos de nombre/teléfono/email, pero `EvaluationForm.tsx:37-49` ya usa `LIMITES.*` | `sed` de `EvaluationForm.tsx:37-49` | S | VERIFICADO |
| Media | `src/app/sitemap.ts:9-20` | Fechas `lastModified` de páginas fijas escritas a mano (ya listado como riesgo #6 en ARQUITECTURA). Se pueden desactualizar sin aviso | Lectura | S | VERIFICADO |
| Media | `src/app/(site)/direccion/page.tsx:44` | `<img>` en vez de `next/image` (único warning de lint). Tiene `alt`, `width` y `height` | `npx eslint` | S | VERIFICADO |
| Baja | `src/components/blog/Cover.tsx:9` | `alt=""` en portadas de notas: correcto si son decorativas, pero si la portada aporta información el lector de pantalla no la ve | Línea 9 | S | VERIFICADO (el `alt` vacío); si debería tener texto: INFERIDO |
| Baja | `src/middleware.ts` | Archivo `middleware.ts` obsoleto en Next 16 (migración a `proxy.ts` bloqueada por OpenNext, documentado) | Comentario del propio archivo + `docs/ARQUITECTURA.md:82` | M (bloqueado) | VERIFICADO |
| Baja | `.claude/skills/` (142 archivos versionados) | Skills de terceros (p. ej. `amazon-keyspaces`, `creating-secrets-using-best-practices`) commiteadas en el repo del sitio: ruido en el repo y en el grafo | `git ls-files \| grep "^\.claude" \| wc -l` | S | VERIFICADO (están trackeadas); que sean innecesarias: INFERIDO |
| Baja | `graphify-out/GRAPH_REPORT.md` | El grafo no representa 123 de 316 archivos (39 %), según su propia advertencia | Cabecera del reporte | S | VERIFICADO |
| Baja | Ramas remotas sin mergear | `origin/claude/whatsapp-agente-v2` (+1, 2026-10-07), `claude/tender-bardeen-he3nhn` (+1, "Paleta de brasa", 2026-10-06), `claude/whatsapp-customer-service-agent-vh8x2l` (+2, 2026-08-14), `cloudflare/workers-autoconfig` (+1), `vercel/install-*` (+1 c/u, abril). Decidir mergear o borrar | `git rev-list --count main..origin/<rama>` | S | VERIFICADO |

## Lo que salió bien (verificado)

- **Marcas de pendiente**: 0 `TODO/FIXME/HACK/XXX/WIP/próximamente/lorem` en `src/`, `scripts/`, `docs/`, `README.md`, `worker.ts` y `marketing_engine/` (excluyendo `.venv`). Los falsos positivos de "pendiente/todo" son español normal en el contenido.
- **Git**: árbol limpio, sin stashes, sin archivos sin trackear, sin commits "wip" en los últimos 30.
- **Código incompleto**: sin handlers vacíos ni `href="#"`. Todas las páginas están en el sitemap y enlazadas (nav/footer/`areas`). Solo hay 2 rutas API: `intake` y `intake/reintentar`.
- **Docs vs código**: todos los archivos mencionados en `ARQUITECTURA.md`, `COMPONENTES.md` y `README.md` existen (`blog.ts`, `tips.ts`, `schema.ts`, `metadata.ts`, `JsonLd.tsx`, `Alert/Field/Button`, `loading.tsx`, `build-content.mjs`, `markdown.mjs`, `worker.ts`). `proxy.ts` aparece solo como nota de migración futura. Las excepciones son las dos de arriba.
- **Seguridad de intake**: validación zod server-side con límites; honeypot; Turnstile verificado antes de procesar y sin "humano por defecto"; `escapeHtml` aplicado a todos los campos interpolados en los mails (`correo.ts:32-88,127`); la ruta de reintento solo responde a pedidos internos (sin `cf`, devuelve 404); retención en KV de 30 días; sin secretos hardcodeados (grep de `sk-`/`AIza`/`EAA`/`password=` sin hallazgos reales; `.env*` no versionados; solo `marketing_engine/.env.example`); `.venv` no está versionado; `.claude/settings.json` ignorado. Los `console.*` no loguean el payload del formulario (solo `requestID` y errores), salvo la duda de `errData` arriba.
- **SEO**: todas las páginas (`page.tsx`) referencian metadata; `metadataBase`, canonical, Open Graph, `lang="es-AR"`, `robots.ts` (bloquea `/api/`), `sitemap.ts` completo (home, áreas, tips, blog, páginas fijas), `og-image.jpg`, `llms.txt`, noindex en `*.workers.dev`.
- **Accesibilidad**: `prefers-reduced-motion` en `globals.css:74,349,360`, `HeroStage.tsx:31`, `loading.tsx`/`Spinner.tsx` (`motion-reduce`); `SkipLink`, `role="alert"/"status"` documentados.

## No pudo comprobarse

- Build de Cloudflare (`build:cloudflare`/`preview`) y comportamiento real en el Worker (cron, KV, `waitUntil`).
- Que las plantillas de WhatsApp `vindex LEGAL_admision_v2_parte1/2/3` estén aprobadas y que `v25.0` siga vigente (depende del panel de Meta).
- Que "Always Use HTTPS" y Turnstile estén configurados en el panel de Cloudflare.
- Export no usado: no se corrió una herramienta tipo `knip`/`ts-prune` (no está en el proyecto). El grafo no reportó ciclos de imports.
- Cobertura de `prefers-reduced-motion` por animación individual: se verificó que existen reglas globales, no que cada `@keyframes` (`globals.css:303-342`) quede cubierto.
- Contraste de color/WCAG y navegación por teclado: no se ejecutó una auditoría visual ni con herramientas.

## 5 acciones más urgentes (en orden)

1. **Agregar límite de intentos a `/api/intake`** (Cloudflare Rate Limiting binding o contador en KV por IP/teléfono), porque cada envío dispara mails y 3 WhatsApp a un número elegido por quien llama.
2. **Corregir la normalización de teléfonos para WhatsApp** (`route.ts:42-48`) para cubrir `221…`, `0221…` y `15`: hoy los consultantes de La Plata pueden no recibir el mensaje. Requiere tu decisión (cambia a quién le llega).
3. **Endurecer los `response.json()`** de Turnstile (`route.ts:135`) y Meta (`route.ts:75`) con try/catch y `response.ok`, y dejar de loguear `errData` completo, para que una falla externa no tire las partes 2 y 3 ni vuelque datos personales al log.
4. **Actualizar `docs/ARQUITECTURA.md`** (riesgos #2 y #5 ya resueltos o desactualizados; v18.0 → v25.0) y generar el ID de consulta con `crypto.randomUUID()`/más entropía.
5. **Limpiar el repo**: decidir las 6 ramas remotas sin mergear (en especial `whatsapp-agente-v2` y la de la paleta "brasa"), sacar `.claude/skills/` de terceros del versionado y reemplazar el `<img>` de `direccion/page.tsx:44`.

Esperando tu aprobación antes de tocar nada.
