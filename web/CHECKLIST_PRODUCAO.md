# Checklist de Produção — Acordei, virei líder

Marque cada item antes de publicar. Legenda: 🔴 bloqueia o go-live · 🟡 recomendado · 🟢 opcional.

## A. Domínio & Vercel
- [ ] 🔴 Definir o **domínio de produção** (Vercel → projeto `web` → Settings → Domains). Anotar como `DOMINIO`.
- [ ] 🔴 **Env vars de produção** (Vercel → Settings → Environment Variables, escopo *Production*):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `NEXT_PUBLIC_SITE_URL` = `https://DOMINIO`
  - [ ] `HOTMART_HOTTOK` = token **real** (hoje é placeholder `SEU_HOTTOK`)
- [ ] 🔴 Publicar em produção: `vercel --prod` (ou promover o deploy). Refazer o deploy **após** setar as envs.

## B. Supabase
- [x] Migrations `0001`/`0002`/`0003` aplicadas (`assinantes`, `admins`, `is_admin`, RLS).
- [ ] 🔴 **Auth → URL Configuration**:
  - [ ] **Site URL** = `https://DOMINIO`
  - [ ] **Redirect URLs** inclui `https://DOMINIO/definir-senha`
- [x] RLS habilitado em `assinantes` e `admins`.
- [ ] 🟡 Trocar a senha do admin (`acordei.vireilider@gmail.com`) — a atual (`Acordei@123`) é fraca.
- [ ] 🔴 **Remover os dados de teste** antes do go-live: lead/conta `acordei.vireilider+teste@gmail.com`.
- [ ] 🟢 Configurar **SMTP próprio** (só se um dia quiser usar e-mails; hoje o acesso é por link, então não bloqueia).

## C. Hotmart
- [ ] 🔴 Copiar o **hottok real** (Ferramentas → Webhook) → colar em `HOTMART_HOTTOK` (item A).
- [ ] 🔴 Cadastrar o webhook: `https://DOMINIO/api/webhooks/hotmart`, assinando: compra **aprovada/completa**, **reembolso**, **chargeback**, **cancelamento de assinatura**.
- [ ] 🟡 Confirmar as **URLs de checkout** dos planos (hoje os 3 usam `F106532691P`). Se o Premium ganhar produto próprio, atualizar `src/lib/hotmart/checkout.ts`.
- [ ] 🟡 Enviar um **evento de teste** pela Hotmart e conferir se o `pagamento_status` muda no `/admin`.

## D. Segurança
- [x] `/admin` exige login de admin (proxy + revalidação server-side).
- [x] `SUPABASE_SERVICE_ROLE_KEY` só no servidor (nunca `NEXT_PUBLIC_*`).
- [x] Sem policy de UPDATE p/ usuário comum; escrita de status só via server (Service Role).
- [x] Acesso ao `/chat` bloqueia expirado/inativo por `data_fim` (proxy + `/api/chat`).
- [ ] 🟡 Rodar uma revisão de segurança final (`/security-review`).

## E. Conteúdo & UX
- [ ] 🟡 Confirmar **preços/textos** da `/planos` (Aprenda R$39,90 · Mentor IA R$29,90/mês · Evolua 3x R$99,00).
- [ ] 🟡 Confirmar o **WhatsApp de suporte** (hoje `(11) 97466-8867`).
- [ ] 🟢 Página de **Termos de uso** (o `/login` menciona "concorda com os termos").

## F. Smoke test em produção (após publicar)
- [ ] 🔴 Ciclo completo: `/planos` → escolher **Complementar** → `/cadastro` → checkout → aparece no `/admin` → **Liberar Mentor IA** → **Link de acesso** → **definir senha** → `/login` → `/chat` responde.
- [ ] 🟡 Renovação: colocar `data_fim` no passado num assinante → confirmar bloqueio + tela de renovação em `/aguardando`.
- [ ] 🟡 Confirmar que o botão **"Liberar"** não aparece para plano **Básico**.

---

### Observações
- **`/planos` e `/cadastro` são públicas por design** no fluxo novo (não precisam mais de login) — não há nada "temporário" a reverter.
- **Entrega de acesso é por link** (botão "Link de acesso" no painel → WhatsApp). Não depende de e-mail; por isso SMTP é opcional.
- O **webhook é só detector** de pagamento (marca `pagamento_status`). A liberação continua **manual** pelo admin.
