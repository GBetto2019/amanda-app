-- Correcoes criticas de seguranca/arquitetura (Fase 1).
-- Rodar no SQL editor do Supabase, apos 0001. Idempotente.
--
-- Resolve:
--   C1 - "compra antes do login" nao pode gravar em profiles (id referencia
--        auth.users, que ainda nao existe). Passa a gravar em pre_ativacoes.
--   C2 - email de profiles precisa ser unico (todo match compra->conta e por email).
--   M1 - idempotencia real do webhook via tabela webhook_events.

-- --- C2: email unico (case-insensitive, casa com o lower() do webhook) -----------
create unique index if not exists profiles_email_unique on profiles (lower(email));

-- --- C1: pre-ativacoes (compra confirmada antes de o aluno logar) -----------------
create table if not exists pre_ativacoes (
  email                   text primary key,   -- sempre em minusculas
  plano                   text,
  status                  text not null default 'active',
  acesso_expira_em        timestamptz,
  hotmart_subscriber_code text,
  hotmart_transaction     text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- Escrita/leitura apenas pelo servidor (Service Role) e pelo trigger (security
-- definer). Sem policies => nenhum usuario comum acessa.
alter table pre_ativacoes enable row level security;

-- --- M1: eventos de webhook ja processados (idempotencia) -------------------------
create table if not exists webhook_events (
  transaction text not null,
  event       text not null,
  created_at  timestamptz default now(),
  primary key (transaction, event)
);

alter table webhook_events enable row level security;

-- --- C1: trigger de novo usuario faz merge da pre-ativacao, se houver -------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  pre public.pre_ativacoes%rowtype;
  novo_email text := lower(new.email);
begin
  select * into pre from public.pre_ativacoes where email = novo_email;

  if found then
    -- Compra ja confirmada antes do login: cria o perfil ja ativo.
    insert into public.profiles (
      id, email, nome, status, plano,
      acesso_expira_em, hotmart_subscriber_code, hotmart_transaction
    )
    values (
      new.id, novo_email, new.raw_user_meta_data->>'full_name', pre.status, pre.plano,
      pre.acesso_expira_em, pre.hotmart_subscriber_code, pre.hotmart_transaction
    )
    on conflict (id) do nothing;

    delete from public.pre_ativacoes where email = novo_email;
  else
    -- Fluxo normal: perfil pendente ate a compra ser confirmada pelo webhook.
    insert into public.profiles (id, email, nome, status)
    values (new.id, novo_email, new.raw_user_meta_data->>'full_name', 'pending')
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
