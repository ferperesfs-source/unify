export async function requireSupabaseUser(req) {
  const authorization = req.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return { error: 'Sessão obrigatória.', status: 401 }

  const response = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) return { error: 'Sessão inválida ou expirada.', status: 401 }
  return { user: await response.json() }
}

export function unificallyHeaders() {
  if (!process.env.UNIFICALLY_API_KEY) return null
  return { Authorization: `Bearer ${process.env.UNIFICALLY_API_KEY}`, 'Content-Type': 'application/json' }
}

export const unificallyBaseUrl = process.env.UNIFICALLY_API_URL || 'https://api.unifically.com'

export async function forwardResponse(response, res) {
  const body = await response.text()
  res.status(response.status)
  res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
  return res.send(body)
}
