-- Schema inicial do "Acordei, virei lider." (SDD v2, secao 6)
-- Rodar no SQL editor do Supabase.
-- Idempotente: seguro rodar de novo em um banco que ja tenha profiles criada manualmente.

create table if not exists profiles (
  id         uuid references auth.users primary key,
  email      text not null,
  nome       text,
  status     text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Campos novos da v2.0: plano, expiracao de acesso e dados da assinatura Hotmart.
alter table profiles add column if not exists plano text;
alter table profiles add column if not exists acesso_expira_em timestamptz;
alter table profiles add column if not exists hotmart_subscriber_code text;
alter table profiles add column if not exists hotmart_transaction text;

alter table profiles enable row level security;

-- Sem policy de update: o aluno nao pode alterar o proprio status (evita autoativacao).
-- A ativacao so acontece via webhook, usando a Service Role Key no servidor.

drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own
  on profiles for select
  using (auth.uid() = id);

drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own
  on profiles for insert
  with check (auth.uid() = id);

-- Remove qualquer policy de update de uma configuracao anterior (inclusive
-- nomes acentuados de uma tentativa anterior deste script).
drop policy if exists profiles_update_own on profiles;
drop policy if exists "leitura própria" on profiles;
drop policy if exists "inserção própria" on profiles;
drop policy if exists "atualização própria" on profiles;
drop policy if exists "update própria" on profiles;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, nome, status)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'pending')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
