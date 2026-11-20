# Site Moby Cell

Site institucional estático (HTML/CSS/JS, sem framework) para atrair clientes por Google Pesquisa, Maps e Google Ads.

- `scripts/build.mjs` gera todas as páginas em `public/` (`node scripts/build.mjs`). Todo o texto está nesse arquivo.
- `public/assets/js/config.js`: WhatsApp, endpoint de leads e IDs do Google (GA4 / Ads). Vazio = recurso desligado.
- `supabase/`: migração da tabela `site_leads` e Edge Function `site-lead` (formulário → Moby Control).
- Deploy: Vercel (`vercel.json`, saída em `public/`). Sem comando de build: o HTML gerado fica versionado.

## Regras de conteúdo (dossiê Moby Cell v2.0)
Sem preços de impressão/xerox/plastificação; sem camisetas; notebooks e PCs somente formatação; nada de promessas de prazo, garantia ou horário não confirmados; sem dados financeiros internos.
