const API_BASE = import.meta.env.VITE_UNIFICALLY_API_URL || ''

export class UnificallyError extends Error {
  constructor(message, status) { super(message); this.name = 'UnificallyError'; this.status = status }
}

export async function unificallyRequest(path, options = {}) {
  if (!API_BASE) throw new UnificallyError('Configure VITE_UNIFICALLY_API_URL para ativar a integração.', 503)
  const token = localStorage.getItem('unify_access_token')
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  if (!response.ok) throw new UnificallyError((await response.json().catch(()=>null))?.message || 'Não foi possível concluir a solicitação.', response.status)
  return response.status === 204 ? null : response.json()
}

export const unifically = {
  tools: () => unificallyRequest('/tools'),
  projects: () => unificallyRequest('/projects'),
  runTool: (toolId, payload) => unificallyRequest(`/tools/${toolId}/run`, { method: 'POST', body: JSON.stringify(payload) }),
}
