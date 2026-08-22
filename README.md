# Unify Tools

Interface React/Vite com landing page, login e dashboard, preparada para integrar a API da Unifically.

## Desenvolvimento local

```bash
npm ci
npm run dev
```

Copie `.env.example` para `.env` e defina `VITE_UNIFICALLY_API_URL` quando os endpoints estiverem disponíveis. O adaptador fica em `src/services/unifically.js`.

## Deploy na Vercel

O projeto inclui `vercel.json` com instalação reprodutível, build Vite, diretório de saída e fallback de SPA.

1. Importe este repositório na Vercel.
2. Cadastre `VITE_UNIFICALLY_API_URL` em **Settings → Environment Variables**.
3. Faça o deploy. A Vercel executará `npm ci` e `npm run build`.

Não salve chaves secretas em variáveis prefixadas com `VITE_`: elas são expostas ao navegador. A autenticação privada da Unifically deve passar por uma função server-side quando a API real for conectada.
