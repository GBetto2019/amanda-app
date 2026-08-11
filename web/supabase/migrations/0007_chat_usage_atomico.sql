-- Incremento atômico do teto diário do Mentor IA.
-- Rodar no SQL editor do Supabase, após 0005. Idempotente.
--
-- Motivo: a rota lia o contador e depois gravava contador+1. Duas mensagens
-- enviadas ao mesmo tempo (duas abas) liam o mesmo valor e gravavam o mesmo
-- incremento, contando como uma só. Aqui a leitura e a escrita acontecem numa
-- única instrução, sob o lock da linha.
--
-- Retorna o contador já incrementado, ou -1 quando o aluno JÁ estava no teto
-- (nesse caso nada é gravado, então o contador não cresce indefinidamente).

create or replace function incrementa_chat_usage(
  p_user_id uuid,
  p_dia     date,
  p_limite  int
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  novo int;
begin
  insert into chat_usage (user_id, dia, contador)
  values (p_user_id, p_dia, 1)
  on conflict (user_id, dia) do update
    set contador = chat_usage.contador + 1
    where chat_usage.contador < p_limite
  returning contador into novo;

  -- Sem linha retornada = o WHERE do DO UPDATE barrou: já estava no teto.
  if novo is null then
    return -1;
  end if;

  return novo;
end;
$$;

-- A função roda como dona da tabela (security definer), então só o servidor
-- pode chamá-la. Nenhum acesso para anon/authenticated.
revoke all on function incrementa_chat_usage(uuid, date, int) from public;
grant execute on function incrementa_chat_usage(uuid, date, int) to service_role;
