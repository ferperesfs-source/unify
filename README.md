# Unify Tools

Interface React/Vite com landing page, login e dashboard, preparada para integrar a API da Unifically.

## Desenvolvimento local

```bash
npm ci
npm run dev
```

Copie `.env.example` para `.env.local` e configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. O catálogo, autenticação, perfis e projetos usam o Supabase real.

A Unifically é acessada exclusivamente pelas funções server-side em `api/unifically`. Configure `UNIFICALLY_API_KEY` na Vercel; nunca use prefixo `VITE_` nessa chave. O frontend envia a sessão Supabase para o proxy, que valida o usuário antes de acessar modelos ou tarefas.

As tabelas, políticas RLS, índices e dados iniciais do catálogo estão documentados em `supabase/migrations`.

## Deploy na Vercel

O projeto inclui `vercel.json` com instalação reprodutível, build Vite, diretório de saída e fallback de SPA.

1. Importe este repositório na Vercel.
2. Cadastre `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `UNIFICALLY_API_URL` e `UNIFICALLY_API_KEY` em **Settings → Environment Variables**.
3. Faça o deploy. A Vercel executará `npm ci` e `npm run build`.

Não salve chaves secretas em variáveis prefixadas com `VITE_`: elas são expostas ao navegador. A autenticação privada da Unifically deve passar por uma função server-side quando a API real for conectada.
