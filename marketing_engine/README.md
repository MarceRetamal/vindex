# Marketing Engine · Vindex Legal

Departamento de marketing digital automatizado de Vindex Legal. Siete agentes especializados, orquestados con **LangGraph**, que investigan en tiempo real con **Google Search Grounding** (`google-genai`), diseñan la oferta, redactan, auditan y publican contenido en `src/content/blog/` y `src/content/tips/`. 100% Python, sin n8n.

Objetivo: captación orgánica de consultas (`/evaluacion` y WhatsApp) en 90 días, sin presupuesto publicitario.

## Cómo funciona

```
CMO ─► Radar ─► Oferta/CRO ─┬─► Redactor Blog ─┐
 ▲                           └─► Redactor Tip ──┤
 │                                              ▼
 │                                          AUDITOR ─► aprobado ─► Publicador ─► commit
 │                                              │
 │                              rechazado (≤ 3 revisiones) ─► vuelve al redactor
 │                                              │
 └──── reformular ◄── CMO (escalamiento) ◄── más de 3 fallos
                              └─► abortar: no se publica nada
```

| # | Agente | Archivo | Qué hace |
|---|---|---|---|
| 01 | CMO y Orquestador | `agents/agente_01_cmo.py` | Lee el inventario, mide cobertura por área, aplica el plan de 90 días y emite el brief. Resuelve los escalamientos. |
| 02 | Radar de Inteligencia SEO/GEO | `agents/agente_02_intel_radar.py` | Búsqueda en tiempo real (normas vigentes, fallos de PBA/La Plata, organismos, preguntas reales, competencia). Marca como *verificado* solo lo respaldado por una fuente realmente consultada. |
| 03 | Oferta y CRO (Hormozi) | `agents/agente_03_offer_cro.py` | Ecuación de Valor, titulares, respuesta directa para IA y bloque de **Chequeo rápido** en el primer tercio. |
| 04 | Redactor de Blog | `agents/agente_04_blog_writer.py` | Nota larga (1.000-1.900 palabras), FAQ compatible con `FaqSchema.tsx`, enlaces internos. |
| 05 | Redactor de Tips | `agents/agente_05_tip_writer.py` | Guía corta de acción en las primeras 48 horas. |
| 06 | Auditor | `agents/agente_06_auditor.py` | Ética (Ley 5177 PBA), precisión jurídica, schema, SEO/GEO y conversión. Bloqueante. |
| 07 | Publicador | `agents/agente_07_publisher.py` | Escribe `.md` y portada SVG, actualiza `public/llms.txt`, valida el build y commitea. |

Piezas de soporte: `config.py` (marca, ética, plan de 90 días), `state.py` (estado compartido), `llm.py` (Gemini y grounding), `tools/repo_tools.py` (inventario, validación y compilación), `mock_llm.py` (pruebas sin red).

## Instalación

Requiere Python 3.11+ y Node.js (el mismo que usa el sitio). Todo se ejecuta **desde la raíz del repositorio**.

```bash
python3 -m venv marketing_engine/.venv
source marketing_engine/.venv/bin/activate
pip install -r marketing_engine/requirements.txt
cp marketing_engine/.env.example marketing_engine/.env
# editá marketing_engine/.env y completá GEMINI_API_KEY (https://aistudio.google.com/apikey)
```

## Uso

Primera ejecución de prueba, sin tocar el repo:

```bash
python -m marketing_engine.main --mode auto --dry-run --ignore-cadence
```

| Comando | Qué hace |
|---|---|
| `--mode auto` | El CMO decide qué publicar hoy según el plan de 90 días y la cadencia semanal. |
| `--mode blog --area <slug> --topic "<tema>"` | Fuerza una nota de blog. |
| `--mode tip --area <slug> --topic "<tema>"` | Fuerza un tip. Solo áreas con categoría en `/tips`. |
| `--dry-run` | Corre todo el flujo y la auditoría **sin modificar el repo**. La vista previa queda en `marketing_engine/.runs/<id>/preview/`. |
| `--ignore-cadence` | En modo auto, publica aunque hoy sea día de descanso. |
| `--branch <rama>` / `--push` | Rama de commit y push (pisan `GIT_BRANCH` y `GIT_PUSH`). |
| `--list-areas` | Áreas válidas, cobertura y prioridad actual. |
| `--mock` | LLM simulado, sin red ni clave (solo con `--dry-run`). Para probar el grafo. |

Ejemplos:

```bash
python -m marketing_engine.main --list-areas
python -m marketing_engine.main --mode blog --area sucesiones --topic "cuánto tarda una sucesión con inmuebles en La Plata" --dry-run
python -m marketing_engine.main --mode tip --area accidentes-laborales-art --topic "la ART rechazó mi accidente" --dry-run
```

Códigos de salida: `0` publicado o simulación aprobada, `1` abortado sin publicar, `2` error de ejecución. Cada corrida deja bitácora, estado y borrador en `marketing_engine/.runs/<id>/` (ignorado por git).

Para probar el bucle de revisiones y el escalamiento: `MOCK_FORCE_REJECTIONS=2 python -m marketing_engine.main --mode auto --dry-run --mock --ignore-cadence` (con 4 o más rechazos forzados se activa el escalamiento al CMO).

## Qué garantiza el motor antes de publicar

1. **Schema exacto.** El `.md` lo arma Python (el modelo nunca escribe el YAML) con el formato de `_PLANTILLA.txt`; se valida con PyYAML y con una réplica del parser de `scripts/build-content.mjs`.
2. **Compila en un sandbox.** Se copia `scripts/` y el contenido a un directorio temporal, se suma la pieza y se corre `node scripts/build-content.mjs`. Se comprueba que el sitio lea el mismo resumen, FAQ y subtítulos que se escribieron.
3. **Subconjunto de markdown del sitio.** `scripts/markdown.mjs` solo soporta `##`, párrafos, listas, `!!`, `>`, negrita, cursiva y enlaces. **No soporta tablas, `###` ni imágenes**, y cada ítem de lista debe ir separado por una línea en blanco. Por eso las "tablas comparativas" se escriben como listas con etiqueta en negrita; el Auditor rechaza tablas con barras.
4. **Ética.** Lista de patrones prohibidos (promesas de resultado, gratuidad, escasez, cuota litis, testimonios, cifras de éxito, comparaciones laudatorias) más juicio del Auditor.
5. **Fallos verificados.** Una carátula o número de expediente que el Radar no haya verificado en una fuente realmente consultada bloquea la publicación.
6. **Sin canibalización.** Se compara el tema contra todo el contenido existente antes de escribir y de nuevo en la auditoría.
7. **Nada a medias.** Si falla el build real tras escribir, el publicador revierte los archivos. Nunca sobrescribe una pieza existente.

## Publicación y revisión humana

El publicador **commitea pero no hace push** salvo que se pida (`--push` o `GIT_PUSH=true`). Cada merge a `main` dispara Workers Builds, que corre `npm run build:cloudflare`. El flujo recomendado:

1. El motor commitea en una rama de revisión (`GIT_BRANCH=marketing/auto`).
2. Se abre un pull request y el Dr. Retamal lo revisa antes de mergear.

Contenido jurídico firmado por el estudio y publicado sin lectura de un abogado es un riesgo profesional y de reputación, y los buscadores penalizan el contenido masivo sin supervisión. El Auditor reduce el riesgo pero no lo elimina.

## Automatización (cron)

Cadencia por defecto: lunes y jueves nota de blog; martes, miércoles y viernes tip; fin de semana sin publicación (`PLAN_CADENCE` en `.env`). El plan arranca el `PLAN_START_DATE`.

Ejemplo de `crontab -e` (lunes a viernes 09:00, hora de Buenos Aires), en un clon dedicado del repositorio:

```cron
CRON_TZ=America/Argentina/Buenos_Aires
0 9 * * 1-5 cd /ruta/al/vindex && git checkout main -q && git pull -q --ff-only && marketing_engine/.venv/bin/python -m marketing_engine.main --mode auto --push >> marketing_engine/.runs/cron.log 2>&1
```

Con `GIT_BRANCH=marketing/auto` y `GIT_PUSH=true`, cada corrida suma un commit a esa rama y la deja lista para un pull request. Con el cron, usá un clon que no sea tu copia de trabajo: el publicador cambia de rama.

Alternativa en GitHub Actions: programar un workflow con `schedule`, instalar Python y Node, guardar `GEMINI_API_KEY` como secreto del repositorio y correr el mismo comando; la rama se empuja con el `GITHUB_TOKEN`.

## Plan de 90 días

Se define en `config.py` (`PLAN_90_DIAS`):

- **Fase 1, días 1-30, fundación e indexación.** Una nota pilar por área con menos cobertura y tips de emergencia enlazados a su pilar.
- **Fase 2, días 31-60, long-tail y clusters.** Preguntas reales de usuarios, brechas de la competencia, respuestas directas y FAQ para buscadores con IA.
- **Fase 3, días 61-90, autoridad y conversión.** Novedades normativas y fallos locales verificados, notas de decisión, refuerzo de `/evaluacion` y WhatsApp.

La prioridad de cada área combina su peso comercial (`peso_conversion`, juicio estratégico a ajustar con datos de Search Console), la poca cobertura y los días sin publicar. Estado actual: `--list-areas`.

## Límites conocidos

- Los tips solo pueden pertenecer a las categorías de `CATEGORIAS_TIPS` (`src/lib/tips.ts`): Amparos, Familia, Tránsito, Laboral y ART. Penal, Sucesiones y Consumidor se cubren con notas de blog hasta que el sitio sume esas categorías.
- Google retira modelos con frecuencia (`gemini-2.5-pro` ya no está disponible para cuentas nuevas). Los `MODEL_*` son configurables en `.env`; `python -m marketing_engine.main --list-models` muestra los que tu clave puede usar.
- Las reglas éticas están codificadas como principios y patrones, sin citar artículos de la Ley 5177 ni del Código de Ética del CALP. [CITA A VERIFICAR: artículos de la Ley 5177 y del Código de Ética del Colegio de Abogados sobre publicidad, captación de clientela y promesa de resultados.] Hay que contrastar `PRINCIPIOS_ETICOS` y `PATRONES_PROHIBIDOS` en `config.py` con el texto vigente.
- La verificación de fuentes del Radar compara dominios consultados por el buscador con los dominios que el modelo declara; reduce las invenciones pero no reemplaza la lectura humana de fallos y normas citados.
- Los listados numerados de los tips existentes (`src/content/tips/*.md`) tienen los ítems en líneas consecutivas, y el conversor actual los fusiona en un solo `<li>`. El motor genera listas correctas, pero el contenido ya publicado se ve afectado.
