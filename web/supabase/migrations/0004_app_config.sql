-- Configurações editáveis pelo admin (ex.: prompt do Mentor IA).
-- Rodar no SQL editor do Supabase, após 0003. Idempotente.

create table if not exists app_config (
  key        text primary key,     -- ex.: 'system_prompt'
  value      text,
  updated_at timestamptz not null default now()
);

alter table app_config enable row level security;

-- Apenas admin lê/escreve pela sessão do usuário. O servidor (Service Role)
-- ignora RLS, então o /api/chat consegue ler o prompt mesmo para o aluno.
drop policy if exists app_config_admin on app_config;
create policy app_config_admin on app_config
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
