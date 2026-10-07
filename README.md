This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Asistente de WhatsApp (embudo de consultas)

El número de WhatsApp Business del estudio (+54 9 11 4174-3745) está conectado a un asistente con IA (Claude) que recibe, contiene y califica las consultas, y las pasa al estudio. Todo el código vive en `src/lib/whatsapp/` y el webhook en `src/app/api/whatsapp/webhook/route.ts`.

**Cómo funciona el embudo**
1. La persona llega desde el botón "Consultar por WhatsApp" de cada página de área (el mensaje ya viene escrito, por ejemplo "Hola, consulto por derecho laboral") o escribiendo directo.
2. El asistente se presenta como IA, avisa de la retención de 30 días y de la política de privacidad, y la deja contar su caso. Pide de a poco nombre, tema, localidad y urgencia.
3. Con datos suficientes marca la consulta como lista (`leadReady`): llega **una sola vez** al correo del estudio con el mismo formato del formulario del sitio y se mide en Google Analytics como `generate_lead` (`form: whatsapp`).
4. Si detecta una urgencia real (detención, medida cautelar, plazo en horas), avisa por correo al instante.

**Límites del asistente:** no da asesoramiento jurídico, no habla de honorarios ni promete resultados, y solo responde a quien escribe primero.

**Seguridad y privacidad**
- La firma `X-Hub-Signature-256` es obligatoria: sin `WA_APP_SECRET` el webhook responde 503 y no procesa nada.
- Tope de 20 mensajes por contacto y hora, para cuidar el gasto de la API.
- La memoria (perfil e historial) vive en Cloudflare KV y **vence sola a los 30 días del primer mensaje** (tope fijo, no se renueva).
- Las claves **nunca** se versionan: `.dev.vars` está en `.gitignore`; la plantilla es `.dev.vars.example`. En producción: `npx wrangler secret put NOMBRE`.

**Variables:** `WA_PHONE_NUMBER_ID`, `WA_ACCESS_TOKEN`, `WA_APP_SECRET`, `WA_VERIFY_TOKEN`, `ANTHROPIC_API_KEY` (obligatorias); `CLAUDE_MODEL` (por defecto `claude-sonnet-5`) y `GA_API_SECRET` (opcional, para medir conversiones).

**Webhook en Meta for Developers:** `https://vindexlegal.com.ar/api/whatsapp/webhook`, con el mismo valor de `WA_VERIFY_TOKEN`, suscripto al campo `messages`.

**Para actualizar las áreas:** si cambian en `src/data/areas.ts`, actualizar también `src/lib/whatsapp/knowledge.ts` y `menus.ts`.
