# Unify Tools

Interface React/Vite com landing page, login e dashboard, preparada para integrar a API da Unifically.

## Desenvolvimento local

```bash
npm ci
npm run dev
```

Copie `.env.example` para `.env.local` e configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. O catálogo, autenticação, perfis e projetos usam o Supabase real. O adaptador da Unifically permanece em `src/services/unifically.js` para os endpoints futuros.

As tabelas, políticas RLS, índices e dados iniciais do catálogo estão documentados em `supabase/migrations`.

## Deploy na Vercel

O projeto inclui `vercel.json` com instalação reprodutível, build Vite, diretório de saída e fallback de SPA.

1. Importe este repositório na Vercel.
2. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em **Settings → Environment Variables**. Cadastre `VITE_UNIFICALLY_API_URL` somente quando a API estiver disponível.
3. Faça o deploy. A Vercel executará `npm ci` e `npm run build`.

Não salve chaves secretas em variáveis prefixadas com `VITE_`: elas são expostas ao navegador. A autenticação privada da Unifically deve passar por uma função server-side quando a API real for conectada.
