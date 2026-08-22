create index if not exists unify_generations_project_idx
  on public.unify_generations (project_id)
  where project_id is not null;
