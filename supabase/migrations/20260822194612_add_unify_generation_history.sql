create table public.unify_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid references public.unify_projects(id) on delete set null,
  task_id text,
  model_id text not null,
  category text not null check (category in ('image', 'video', 'audio', 'llm')),
  status text not null default 'processing' check (status in ('processing', 'completed', 'failed')),
  prompt text not null check (char_length(prompt) between 1 and 12000),
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error_message text,
  cost numeric(12, 6),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, task_id)
);

create index unify_generations_user_created_idx
  on public.unify_generations(user_id, created_at desc);
create index unify_generations_user_status_idx
  on public.unify_generations(user_id, status);

alter table public.unify_generations enable row level security;

create policy "unify_generations_select_own"
  on public.unify_generations for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "unify_generations_insert_own"
  on public.unify_generations for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "unify_generations_update_own"
  on public.unify_generations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "unify_generations_delete_own"
  on public.unify_generations for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.unify_generations to authenticated;

create trigger set_unify_generations_updated_at
  before update on public.unify_generations
  for each row execute function private.set_unify_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'unify-references',
  'unify-references',
  false,
  104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "unify_reference_files_select_own"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'unify-references'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "unify_reference_files_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'unify-references'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "unify_reference_files_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'unify-references'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
