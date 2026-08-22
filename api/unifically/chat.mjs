import { forwardResponse, requireSupabaseUser, unificallyBaseUrl, unificallyHeaders } from './_auth.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' })
  const auth = await requireSupabaseUser(req)
  if (auth.error) return res.status(auth.status).json({ error: auth.error })
  const headers = unificallyHeaders()
  if (!headers) return res.status(503).json({ error: 'UNIFICALLY_API_KEY ainda não configurada.' })
  if (!req.body?.model || !Array.isArray(req.body?.messages)) return res.status(400).json({ error: 'model e messages são obrigatórios.' })
  const response = await fetch(`${unificallyBaseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...req.body, stream: false }),
  })
  return forwardResponse(response, res)
}
