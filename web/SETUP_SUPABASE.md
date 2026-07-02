# Setup operacional — Supabase & envs (modelo manual)

Passos de configuração fora do código para o fluxo funcionar de ponta a ponta.

## 1. Migrations (SQL Editor do Supabase)
Rodar, em ordem, o conteúdo de `web/supabase/migrations/`:
- `0001_profiles.sql` (legado — pode já estar aplicado)
- `0002_seguranca_webhook.sql` (legado)
- `0003_pivot_manual_admin.sql` — **cria `assinantes` e `admins`** (essencial)

## 2. Primeiro administrador
1. Authentication → Users → **Add user** (e-mail + senha do admin).
2. Copie o UUID do usuário e rode no SQL Editor:
   ```sql
   insert into admins (user_id) values ('COLE-O-UUID') on conflict do nothing;
   ```
3. Acesse `/admin/login` com esse e-mail/senha.

## 3. E-mail de "definir senha" (convite)
O botão **Liberar Mentor IA** usa `inviteUserByEmail`, que dispara o e-mail com o
link para o assinante definir a senha. Para funcionar:

- **Authentication → URL Configuration**
  - **Site URL:** o domínio de produção (ex.: `https://acordeivireilider.com.br`).
  - **Redirect URLs (allowlist):** adicionar `${DOMINIO}/definir-senha` (e a URL de
    preview, se for testar em preview).
- **Authentication → Email Templates → Invite user:** ajustar o texto/marca. O link
  deve apontar para o `{{ .ConfirmationURL }}` (padrão).
- (Recomendado em produção) configurar **SMTP próprio** em Authentication → SMTP,
  pois o e-mail nativo do Supabase tem limite de envio baixo.

## 4. Variáveis de ambiente (Vercel + `.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `ANTHROPIC_API_KEY`
- `HOTMART_HOTTOK` — **token real** da Hotmart (hoje está placeholder `SEU_HOTTOK`)
- `NEXT_PUBLIC_SITE_URL` — domínio canônico (garante que o link do convite não use
  uma URL de preview fora da allowlist)

## 5. Webhook Hotmart (detector de pagamento)
Cadastrar em Hotmart → Ferramentas → Webhook a URL:
`${DOMINIO}/api/webhooks/hotmart`, assinando os eventos de compra aprovada,
reembolso, chargeback e cancelamento. O webhook apenas **marca** `pagamento_status`
no painel — a liberação continua manual.
