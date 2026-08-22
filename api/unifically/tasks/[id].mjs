import { forwardResponse, requireSupabaseUser, unificallyBaseUrl, unificallyHeaders } from '../_auth.mjs'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' })
  const auth = await requireSupabaseUser(req)
  if (auth.error) return res.status(auth.status).json({ error: auth.error })
  const headers = unificallyHeaders()
  if (!headers) return res.status(503).json({ error: 'UNIFICALLY_API_KEY ainda não configurada.' })
  const id = String(req.query.id || '')
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return res.status(400).json({ error: 'ID de tarefa inválido.' })
  const response = await fetch(`${unificallyBaseUrl}/v1/tasks/${encodeURIComponent(id)}`, { headers })
  return forwardResponse(response, res)
}
