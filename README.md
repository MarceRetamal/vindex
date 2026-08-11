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

## Agente de atención al público en WhatsApp

`src/app/api/whatsapp/webhook/route.ts` implementa un agente conversacional con IA (Claude) para el WhatsApp Business de VINDEX LEGAL. Recibe cada mensaje entrante, responde con criterio propio (con memoria por contacto), ofrece menús interactivos (listas y botones) y avisa por correo al estudio cuando corresponde derivar con un abogado humano.

La lógica vive en `src/lib/whatsapp/`:

- `agent.ts` — arma el prompt y llama a la API de Claude con salida estructurada (JSON) para decidir la respuesta, el menú a mostrar, si hay que escalar y cómo actualizar el perfil del contacto.
- `graph.ts` — cliente de la Graph API de Meta (texto, listas, botones, marcar como leído).
- `menus.ts` — los menús interactivos tienen estructura fija (WhatsApp exige límites de longitud); el modelo elige cuál mandar, nunca genera el JSON del menú.
- `kv.ts` — memoria por contacto (perfil + historial) en Cloudflare KV, y deduplicación de reintentos del webhook.
- `mailer.ts` — aviso por correo al estudio cuando el agente decide derivar a un humano.
- `knowledge.ts` — los hechos institucionales (áreas de práctica, dirección letrada, etc.) que el agente puede usar; no inventa datos por fuera de esto.

### Configuración necesaria

1. **KV namespace** (memoria de conversaciones):
   ```bash
   npx wrangler kv namespace create WHATSAPP_KV
   ```
   Reemplazá el `id` de `REPLACE_WITH_KV_NAMESPACE_ID` en `wrangler.jsonc` por el que devuelva el comando.

2. **Secretos** (nunca van en `wrangler.jsonc`, que es público en el repo):
   ```bash
   npx wrangler secret put WA_PHONE_NUMBER_ID
   npx wrangler secret put WA_ACCESS_TOKEN
   npx wrangler secret put WA_APP_SECRET      # App secret de Meta, para verificar la firma del webhook
   npx wrangler secret put WA_VERIFY_TOKEN    # String que vos elegís, se usa en la verificación del webhook
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
   `CLAUDE_MODEL` es opcional (por defecto `claude-sonnet-5`).

   Para desarrollo local, completá esos mismos valores en `.dev.vars` (no se commitea).

3. **Webhook en Meta for Developers**: apuntá el webhook de WhatsApp Business a `https://tu-dominio/api/whatsapp/webhook`, usando el mismo valor de `WA_VERIFY_TOKEN` al verificarlo, y suscribite al campo `messages`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
