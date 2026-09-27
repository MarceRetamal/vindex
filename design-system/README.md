# Sistema de diseño — VINDEX LEGAL

Sistema de diseño formal de tres capas (`primitive → semantic → component`),
extraído del código real de la app (`src/app/globals.css`,
`src/components/ui/*`) usando la metodología de la skill `design-system`
(instalada en `.claude/skills/design-system/`, junto con `brand` y
`ui-styling`, desde https://github.com/MarceRetamal/ui-ux-pro-max-skill).

No reemplaza `src/app/globals.css` — ese archivo sigue siendo la fuente
que consume la app en producción. Este sistema es la capa de
documentación/gobernanza: formaliza esos mismos valores en un esquema
versionable (JSON), permite regenerar CSS o config de Tailwind desde una
sola fuente, y detecta drift (valores hardcodeados que se escapan del
sistema).

## Archivos

| Archivo | Qué es |
|---|---|
| `design-tokens.json` | Fuente de verdad. Primitivos → semánticos → componente, con referencias `{a.b.c}` resueltas por `generate-tokens.cjs`. |
| `design-tokens.css` | Variables CSS generadas a partir del JSON (`:root`). Auto-generado, no editar a mano. |

## Identidad visual (lo que este sistema formaliza)

- **Superficie**: negro premium en 5 profundidades (`bg-deep` → `bg-float`),
  nunca negro puro plano — da jerarquía sin recurrir a color.
- **Acento**: oro/bronce (`#D4AF37`, hover `#E5C158`, mute `#6B583E`) —
  único color de marca, reservado para CTAs, foco, líneas de énfasis y
  citas de fallos/normas. Nunca como fondo grande ni color de texto de
  cuerpo.
- **Estructura**: grafito y plata (`--vindex-graphite`, `--vindex-silver`)
  para hairlines, bordes de CTA secundario y trazos de ícono — nunca fondo
  ni texto de cuerpo.
- **Tipografía**: familia única, Lato. Black (900) en headings, Bold (700)
  en CTAs/énfasis, Regular (400) en cuerpo, Light + itálica en taglines.
- **Radios**: escalón corto y consistente — 8px controles, 10px campos,
  16px paneles/cards. Nunca "pill" salvo elementos circulares (`full`).
- **Sombras**: difusas y oscuras (`shadow-float`, `card-hover`) o glow de
  acento (`shadow-glow`, `cta-hover`) — sin sombras grises genéricas.
- **Movimiento**: transiciones de 300ms, hover con microdesplazamiento
  (`-translate-y-[1px]` a `[2px]`), nunca abrupto.

## Regenerar el CSS desde el JSON

```bash
node .claude/skills/design-system/scripts/generate-tokens.cjs \
  --config design-system/design-tokens.json \
  -o design-system/design-tokens.css
```

## Auditoría de cumplimiento (drift detectado)

```bash
node .claude/skills/design-system/scripts/validate-tokens.cjs --dir src
```

La corrida actual encuentra **24 colores hex y 20 valores en px
hardcodeados** fuera de los tokens — principalmente en:

- `src/lib/schema.ts` (JSON-LD, sin impacto visual — no ameritan token).
- plantillas de email inline (`style="color: #6B7280"` en HTML de correo:
  los clientes de mail no leen `var()`, así que ahí el hardcode es
  correcto, no drift real).
- `src/app/layout.tsx` (`themeColor`, `bg-[#07090C]`) y
  `src/app/manifest.ts` (`background_color`/`theme_color`): son metadatos
  de plataforma (barra del navegador, PWA), no CSS — tampoco pueden
  consumir `var()`, pero conviene que su valor literal coincida siempre
  con `--bg-deep`/`--bg-main` del JSON si esos cambian.

Ningún hallazgo real está en componentes de UI: `Button`, `Card`, `Input`,
`Section` ya referencian exclusivamente `var(--...)`.

## Extender el sistema

1. Agregar el valor nuevo en la capa que corresponda de
   `design-tokens.json` (primitivo si es un valor crudo nuevo; semántico
   si es un alias de propósito; componente si es específico de un
   componente).
2. Regenerar `design-tokens.css`.
3. Si el componente vive en `src/components/ui/`, referenciar el nuevo
   `var(--...)` ahí en vez de un valor literal.

## Componentes ya cubiertos

`button`, `card`, `input`, `section`, `callout`, `blockquote` — con sus
estados relevantes (hover, focus, disabled) tomados directamente de
`Button.tsx`, `Card.tsx`, `Input.tsx` y las clases `.vindex-*` de
`globals.css`.
