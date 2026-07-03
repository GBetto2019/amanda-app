-- OPCIONAL — remove tabelas legadas do fluxo antigo (Google OAuth + webhook
-- automático). Nada no código atual depende delas. Rodar quando quiser reduzir
-- a superfície do banco. Seguro e idempotente.

drop table if exists webhook_events;
drop table if exists pre_ativacoes;

-- profiles: só era usada pelo trigger antigo. A ação "Excluir" do admin tenta
-- limpar profiles antes de apagar a conta de auth, mas ignora erro se a tabela
-- não existir — então é seguro remover.
drop function if exists public.handle_new_user() cascade;
drop table if exists profiles;
