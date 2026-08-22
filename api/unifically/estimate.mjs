import { requireSupabaseUser, unificallyBaseUrl, unificallyHeaders } from './_auth.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' })
  const auth = await requireSupabaseUser(req)
  if (auth.error) return res.status(auth.status).json({ error: auth.error })
  const headers = unificallyHeaders()
  if (!headers) return res.status(503).json({ error: 'UNIFICALLY_API_KEY ainda não configurada.' })
  if (!req.body?.model || !req.body?.input) return res.status(400).json({ error: 'model e input são obrigatórios.' })

  const response = await fetch(`${unificallyBaseUrl}/v1/tasks`, {
    method: 'POST', headers, body: JSON.stringify({ model: req.body.model, input: req.body.input, dry_run: true }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) return res.status(response.status).json(payload || { error: 'Não foi possível calcular o custo.' })

  let rate = Number(process.env.USD_BRL_RATE) || null
  let rateDate = null
  try {
    const rateResponse = await fetch('https://api.frankfurter.dev/v2/rate/USD/BRL', { signal: AbortSignal.timeout(3500) })
    if (rateResponse.ok) { const ratePayload = await rateResponse.json(); rate = Number(ratePayload.rate) || rate; rateDate = ratePayload.date || null }
  } catch {}
  const cost = Number(payload?.data?.cost)
  return res.status(200).json({ ...payload, data: { ...payload?.data, usd_brl_rate: rate, brl_cost: Number.isFinite(cost) && rate ? cost * rate : null, rate_date: rateDate } })
}
