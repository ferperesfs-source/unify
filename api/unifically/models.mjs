import { forwardResponse, requireSupabaseUser, unificallyBaseUrl, unificallyHeaders } from './_auth.mjs'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' })
  const auth = await requireSupabaseUser(req)
  if (auth.error) return res.status(auth.status).json({ error: auth.error })
  const headers = unificallyHeaders()
  if (!headers) return res.status(503).json({ error: 'UNIFICALLY_API_KEY ainda não configurada.' })
  const category = typeof req.query.category === 'string' ? `?category=${encodeURIComponent(req.query.category)}` : ''
  const response = await fetch(`${unificallyBaseUrl}/v1/models${category}`, { headers })
  return forwardResponse(response, res)
}
