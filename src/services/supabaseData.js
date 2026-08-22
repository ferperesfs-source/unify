import { supabase } from '../lib/supabase'

const requireClient = () => {
  if (!supabase) throw new Error('Supabase não configurado. Adicione as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
  return supabase
}

export async function getCatalog() {
  const { data, error } = await requireClient()
    .from('unify_tools')
    .select('id, slug, name, description, category, icon, color, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function getWorkspace(userId) {
  const client = requireClient()
  const [profileResult, projectsResult] = await Promise.all([
    client.from('unify_profiles').select('id, full_name, company, plan, avatar_url').eq('id', userId).maybeSingle(),
    client.from('unify_projects')
      .select('id, title, status, created_at, updated_at, tool:unify_tools(id, name, icon, color)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(12),
  ])
  if (profileResult.error) throw profileResult.error
  if (projectsResult.error) throw projectsResult.error
  return { profile: profileResult.data, projects: projectsResult.data ?? [] }
}

export async function createProject({ userId, toolId, title }) {
  const { data, error } = await requireClient()
    .from('unify_projects')
    .insert({ user_id: userId, tool_id: toolId || null, title: title.trim(), status: 'draft' })
    .select('id, title, status, created_at, updated_at, tool:unify_tools(id, name, icon, color)')
    .single()
  if (error) throw error
  return data
}

export async function createGenerationRecord({ userId, modelId, category, prompt, input }) {
  const { data, error } = await requireClient()
    .from('unify_generations')
    .insert({ user_id: userId, model_id: modelId, category, prompt, input, status: 'processing' })
    .select('id, task_id, status, output, error_message, cost, created_at, updated_at')
    .single()
  if (error) throw error
  return data
}

export async function updateGenerationRecord(id, changes) {
  const { data, error } = await requireClient()
    .from('unify_generations')
    .update(changes)
    .eq('id', id)
    .select('id, task_id, status, output, error_message, cost, created_at, updated_at')
    .single()
  if (error) throw error
  return data
}

export async function uploadGenerationReference(userId, file) {
  const extension = file.name.includes('.') ? file.name.split('.').pop().replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'bin'
  const path = `${userId}/${crypto.randomUUID()}.${extension || 'bin'}`
  const storage = requireClient().storage.from('unify-references')
  const { error: uploadError } = await storage.upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) throw uploadError
  const { data, error: signedError } = await storage.createSignedUrl(path, 3600)
  if (signedError) throw signedError
  return { path, url: data.signedUrl }
}

export async function getGenerationHistory(userId) {
  const { data, error } = await requireClient()
    .from('unify_generations')
    .select('id, task_id, model_id, category, status, prompt, output, error_message, cost, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data ?? []
}

export async function signInWithPassword(email, password) {
  const { data, error } = await requireClient().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUpWithPassword(email, password, fullName) {
  const { data, error } = await requireClient().auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName.trim() } },
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await requireClient().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/#dashboard` },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await requireClient().auth.signOut()
  if (error) throw error
}
