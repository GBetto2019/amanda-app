-- Pivô de escopo: modelo MANUAL com painel admin (Fase A).
-- Rodar no SQL editor do Supabase, após 0001/0002. Idempotente.
--
-- Novo modelo:
--   - assinantes: lead criado no /cadastro (sem conta) e ativado à mão pelo admin.
--   - admins: quem pode acessar /admin.
--   - Acesso ao Mentor IA governado por acesso_status + data_fim (não mais webhook).

-- --- Tabela de assinantes (leads + ativados) -------------------------------------
create table if not exists assinantes (
  id                  uuid primary key default gen_random_uuid(),
  nome                text,
  email               text not null,
  telefone            text,
  plano_escolhido     text,          -- 'complementar' | 'premium'
  valor               numeric(10,2), -- inserido manualmente pelo admin
  pagamento_status    text not null default 'aguardando',  -- 'aguardando' | 'recebido' (webhook)
  hotmart_transaction text,          -- preenchido pelo webhook detector (Fase C)
  acesso_status       text not null default 'pendente',    -- 'pendente' | 'ativo' | 'inativo'
  data_inicio         date,
  data_fim            date,
  user_id             uuid references auth.users on delete set null,  -- vinculado ao liberar
  liberado_em         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index if not exists assinantes_email_unique on assinantes (lower(email));
create index if not exists assinantes_user_id_idx on assinantes (user_id);

-- --- Tabela de administradores ---------------------------------------------------
create table if not exists admins (
  user_id    uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

-- Verificação de admin (security definer: enxerga admins ignorando RLS).
create or replace function public.is_admin(uid uuid)
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.admins where user_id = uid);
$$;

-- --- RLS -------------------------------------------------------------------------
alter table assinantes enable row level security;
alter table admins enable row level security;

-- Assinante lê apenas o próprio registro.
drop policy if exists assinantes_select_own on assinantes;
create policy assinantes_select_own on assinantes
  for select using (auth.uid() = user_id);

-- Admin lê/escreve tudo (o painel também usa Service Role, que ignora RLS).
drop policy if exists assinantes_admin_all on assinantes;
create policy assinantes_admin_all on assinantes
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Admin enxerga a própria linha em admins (usado na checagem de role).
drop policy if exists admins_select on admins;
create policy admins_select on admins
  for select using (public.is_admin(auth.uid()));

-- --- Remove a automação do fluxo Google/webhook (agora é manual) -----------------
-- O trigger criava um profiles 'pending' a cada login Google. No fluxo manual,
-- a conta é criada pelo admin (convite) e vinculada em assinantes.user_id.
drop trigger if exists on_auth_user_created on auth.users;

-- --- Primeiro admin (rodar manualmente após criar o usuário no Supabase Auth) ----
-- 1. Crie o usuário admin em Authentication > Users (ou via convite).
-- 2. Descubra o UUID dele e rode:
--    insert into admins (user_id) values ('COLE-O-UUID-AQUI') on conflict do nothing;
