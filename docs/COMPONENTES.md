# Sistema de componentes

Guía para construir y mantener la interfaz de vindexlegal.com.ar sin romper el diseño ni la accesibilidad. Complementa `docs/ARQUITECTURA.md`.

## 1. Arquitectura

```
src/components/
├── ui/          Primitivas sin lógica de negocio. Reutilizables en cualquier página.
├── layout/      Estructura global: SiteShell, Header, MobileMenu, Footer, SkipLink.
├── sections/    Bloques de la home (Hero, Áreas, Tips…). Se usan una sola vez.
├── blog/        Piezas de notas y tips (ArticleShell, índice, barra de lectura).
├── forms/       Formularios completos (EvaluationForm).
├── motion/      Animaciones de entrada (FadeIn, StaggerFadeIn, Preloader).
├── seo/         JSON-LD (JsonLd). Los datos salen de src/lib/schema.ts.
└── analytics/   GA4 (GoogleAnalytics, TrackedLink).
```

Las reglas de dependencia van en una sola dirección:

- `ui/` no importa de ninguna otra carpeta de componentes, salvo `motion/` en `PageIntro` y `PageCta`.
- Las páginas (`src/app`) componen `layout/`, `sections/`, `blog/` y `ui/`.
- Los datos viven en `src/data` y `src/lib`, nunca dentro de un componente. Un componente recibe datos por props.
- Por defecto, todo es componente de servidor. `'use client'` solo donde hay estado, efectos o eventos: Header, MobileMenu, EvaluationForm, FloatingWhatsApp, motion y analytics.

## 2. Catálogo y API

### Acciones

**`Button`** (`ui/Button.tsx`): la única forma de dibujar un botón o un enlace con aspecto de botón.

| Prop | Tipo | Defecto | Notas |
|---|---|---|---|
| `href` | `string` | — | Con `href` es un enlace; sin `href`, un `<button>`. |
| `external` | `boolean` | `false` | Solo enlaces: `target="_blank"` y `rel="noopener noreferrer"`. |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Un solo `primary` por bloque. |
| `size` | `'md' \| 'sm'` | `'md'` | `sm` es la versión compacta del encabezado. |
| `arrow` | `boolean` | `true` | Flecha decorativa (oculta a lectores de pantalla). |
| `loading` | `boolean` | `false` | Solo `<button>`: muestra el spinner, deshabilita el botón y marca `aria-busy`. |
| `loadingLabel` | `ReactNode` | — | Texto que se muestra mientras carga. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | El defecto evita envíos accidentales dentro de un formulario. |

Además acepta el resto de los atributos nativos (`onClick`, `aria-*`, `disabled`, etc.).

### Formularios

**`Field`** (`ui/Field.tsx`): etiqueta, control, ayuda y error, ya conectados entre sí.

| Prop | Tipo | Notas |
|---|---|---|
| `id` | `string` | Se usa como `id` del control y como prefijo de `{id}-ayuda` y `{id}-error`. |
| `label` | `ReactNode` | Sin el asterisco: lo agrega `required`. |
| `required` | `boolean` | Asterisco visual (oculto a lectores de pantalla) y `aria-required`. |
| `hint` | `ReactNode` | Ayuda bajo el control, por ejemplo un contador. |
| `error` | `string` | Si existe: `aria-invalid` y `aria-describedby` apuntan al mensaje. |
| `children` | `(control) => ReactNode` | Render prop: aplicá `{...control}` al control. |

`Input`, `Select`, `Textarea` y `Label` son los controles con el estilo de vidrio, y reenvían `ref`, así que funcionan con `register()`.

**`Alert`** (`ui/Alert.tsx`): mensaje en línea. `tone="error"` usa `role="alert"` y se anuncia de inmediato; `tone="info"` usa `role="status"`. Renderizalo solo cuando hay mensaje, para que el anuncio se dispare.

### Contenido

| Componente | Para qué | Props clave |
|---|---|---|
| `Card` | Tarjeta de vidrio con título, texto y pie | `title`, `description`, `eyebrow`, `media`, `footer`, `as` (`h2`/`h3`) |
| `Eyebrow` | Rótulo de página o sección (crece en escritorio) | `children` |
| `Overline` | Rótulo de un bloque interno ("Sobre el autor") | `children`, `as` (`p`/`span`), `className` |
| `SectionTitle` | Título de bloque en mayúsculas | `children`, `as` (`h2`/`h3`) |
| `LinkList` | Lista de enlaces relacionados | `items: { href, texto, extra? }[]`, `className` |
| `FaqList` | Preguntas desplegables (`<details>` nativo) | `items: { pregunta, respuesta }[]` |
| `PageIntro`, `PageCta`, `PageShell`, `Section`, `Container` | Estructura de página | ver cada archivo |

### Estados

| Componente | Estado | Comportamiento |
|---|---|---|
| `EmptyState` | Listado vacío | Título, explicación y una salida (por defecto, "Contar mi caso"). `action={null}` la quita. |
| `StatusPage` | 404 y error inesperado | Título, explicación y acciones; siempre incluye una salida al inicio. |
| `Spinner` | Carga en línea | Decorativo; el estado lo anuncia quien lo usa. |
| `app/(site)/loading.tsx` | Carga de página | Esqueleto con `role="status"` y "Cargando…" para lectores de pantalla. |
| `Button loading` | Envío en curso | Deshabilitado, `aria-busy`, spinner y `loadingLabel`. |

### Layout

- **`SkipLink`**: primer elemento enfocable de cada página. Lleva a `#contenido`, que es el `<main>`.
- **`MobileMenu`**:
  - cerrado, queda `inert`;
  - al abrirse, el foco va al primer enlace;
  - Escape lo cierra y devuelve el foco al botón;
  - mientras está abierto, los elementos con `data-fondo` (contenido, pie y botón de WhatsApp) quedan inertes.

## 3. Ejemplos de uso

```tsx
// Botón de envío con estado de carga
<Button type="submit" loading={isSubmitting} loadingLabel="Enviando..." arrow={false}>
  Enviar mi consulta
</Button>

// Enlaces con aspecto de botón
<Button href="/evaluacion">Contar mi caso</Button>
<Button href="https://wa.me/549..." external variant="secondary">WhatsApp</Button>

// Campo de formulario con react-hook-form
<Field id="email" label="Email (opcional)" error={errors.email?.message}>
  {(control) => <Input {...control} type="email" maxLength={LIMITES.emailMax} {...register('email')} />}
</Field>

// Campo con contador de caracteres
<Field id="message" label="Contanos qué pasó" required error={errors.message?.message}
  hint={`${largo} / ${LIMITES.mensajeMax} caracteres`}>
  {(control) => <Textarea {...control} {...register('message')} />}
</Field>

// Error del servidor
{serverError ? <Alert tone="error">{serverError}</Alert> : null}

// Listado con estado vacío
{notas.length === 0 ? (
  <EmptyState title="Estamos preparando las primeras guías." description="…" />
) : (
  <Grilla notas={notas} />
)}

// Bloque de preguntas frecuentes, con su JSON-LD
<JsonLd data={faqSchema(preguntas)} />
<SectionTitle className="mb-6">Preguntas frecuentes</SectionTitle>
<FaqList items={preguntas} />

// Enlace repetido en una grilla: contexto para lectores de pantalla
<Link href={`/tips/${t.slug}`}>
  Leer el tip<span className="sr-only">: {t.titulo}</span>
</Link>
```

## 4. Buenas prácticas

**Accesibilidad**
- Un solo `<h1>` por página y títulos sin saltos (h1 → h2 → h3). `Card` acepta `as="h2"` cuando va directo bajo el h1.
- Los enlaces que se repiten ("Leer el tip", "Ver más") llevan contexto con `sr-only`.
- Íconos y flechas decorativos llevan `aria-hidden`; los botones solo con ícono llevan `aria-label`.
- Los mensajes que aparecen después de una acción van en `role="alert"` (errores) o `role="status"` (éxito y carga).
- Al reemplazar una vista (éxito del formulario), mové el foco al nuevo título.
- No uses `<main>` dentro de páginas o estados: el `<main>` lo pone `SiteShell`.
- Antes de publicar, auditá con axe: el objetivo es 0 violaciones.

**Formularios**
- Validá con el mismo esquema y los mismos límites que el servidor (`LIMITES` en `src/data/intake.ts`).
- `maxLength` en los campos cortos. En el mensaje, contador visible en lugar de un corte silencioso.
- `noValidate` en el `<form>`: los errores los muestra la interfaz, no el navegador.
- Después de un intento de envío, revalidá al escribir (`reValidateMode: 'onChange'`), para que el diseño no se mueva al hacer clic en "Enviar".

**Diseño**
- Estilos solo con las variables de `globals.css` (`--accent`, `--text-secondary`, `--vindex-silver`…) y las clases `glass*`. Nada de colores sueltos.
- Si un estilo se repite tres veces, va a un componente de `ui/`.
- Probá cada pantalla a 390 px y a 1366 px, con `prefers-reduced-motion` activado.

**Rendimiento**
- Componentes de servidor por defecto.
- En eventos continuos (scroll, puntero): `requestAnimationFrame`, sin `setState` por evento, y cortar el ciclo cuando no hay cambios.

**Experiencia de desarrollo**
- Props tipadas con comentarios JSDoc, que el editor muestra al usar el componente.
- Valores por defecto seguros: `Button` es `type="button"` y `EmptyState` siempre ofrece una salida.
- Componentes chicos y con una sola responsabilidad. Si una página repite el mismo bloque, extraelo.
