import { supabase } from '../lib/supabase'

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Entre na sua conta para usar a Unifically.')
  const response = await fetch(`/api/unifically${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.error?.message || payload?.error || 'Falha ao acessar a Unifically.')
  return payload
}

export const unifically = {
  listModels: category => request(`/models${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  createTask: ({ model, input, callbackUrl }) => request('/tasks', { method: 'POST', body: JSON.stringify({ model, input, ...(callbackUrl ? { callback_url: callbackUrl } : {}) }) }),
  estimateTask: ({ model, input }) => request('/estimate', { method: 'POST', body: JSON.stringify({ model, input }) }),
  getTask: taskId => request(`/tasks/${encodeURIComponent(taskId)}`),
  createChatCompletion: ({ model, prompt }) => request('/chat', { method: 'POST', body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], stream: false }) }),
}
