-- Controle de uso diário do Mentor IA (protege custo/abuso).
-- Rodar no SQL editor do Supabase, após 0004. Idempotente.

create table if not exists chat_usage (
  user_id  uuid not null references auth.users on delete cascade,
  dia      date not null,
  contador int  not null default 0,
  primary key (user_id, dia)
);

-- Escrita/leitura apenas pelo servidor (Service Role). Sem policies para usuário.
alter table chat_usage enable row level security;
