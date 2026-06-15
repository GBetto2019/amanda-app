# SDD — Acordei, virei líder.
**Software Design Document · v2.0 · Junho 2026**

> **Mudanças da v2.0 (resumo executivo)**
> Esta revisão elimina os dois maiores pontos de fricção do produto: a **ativação manual de acesso** (comprovante por WhatsApp → ativação na mão no Supabase) e o **login por senha**. Em seu lugar:
> 1. **Ativação automática via Webhook da Hotmart** — o acesso é liberado no instante em que o pagamento é aprovado, sem intervenção humana.
> 2. **Login com Google (OAuth) + sessão longa** — o aluno entra com um clique, sem criar ou lembrar senha; após o primeiro acesso, o botão na área de membros já o leva ao mentor autenticado.
> 3. **Correções de segurança e modelo de dados** decorrentes — política RLS que impede o aluno de se autoativar, validação de `status` no servidor, idempotência do webhook, e campos de expiração/assinatura para tratar cancelamentos e reembolsos.
> 4. **Decisão de arquitetura registrada** — Hotmart Club como casa do conteúdo (vídeos/PDFs), a plataforma própria como casa do mentor situacional; integração pelo e-mail do comprador.

---

## 1. Visão do Produto

**Acordei, virei líder.** é uma plataforma de mentoria digital para gestores que estão assumindo ou consolidando o primeiro papel de liderança. O produto entrega orientação prática imediata — roteiros prontos, scripts para conversas difíceis e videoaulas — sem linguagem de coach ou palestra motivacional.

### Proposta de valor
> "Seu mentor de bolso que te ajuda a passar pelos primeiros 6 meses na cadeira de Líder."

### Público-alvo
Profissionais promovidos a cargo de liderança recentemente, sem formação formal em gestão, que precisam de orientação prática para situações do dia a dia corporativo.

### Posicionamento do mentor (diferencial competitivo)
O mentor desta plataforma é um **conselheiro situacional**: o aluno chega com um problema real do dia a dia ("minha equipe não me respeita", "preciso demitir alguém pela primeira vez") e recebe um plano de ação com script pronto. Isso é diferente — e complementar — ao **Hotmart Tutor**, o assistente nativo da área de membros, que responde dúvidas *sobre o conteúdo das aulas*. O Tutor explica o curso; o nosso mentor orienta a vida do líder. Os dois podem coexistir (ver seção 9.3).

---

## 2. Stack de Tecnologia

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| Linguagem | TypeScript | ^5 |
| Estilização | Tailwind CSS v4 | ^4 |
| Banco de dados / Auth | Supabase (PostgreSQL + Auth) | — |
| Autenticação | Supabase Auth + Google OAuth | — |
| IA | Anthropic Claude API | claude-opus-4-8 (Premium) / claude-sonnet (Básico) |
| SDK IA | @anthropic-ai/sdk | ^0.103.0 |
| Plataforma de conteúdo + pagamento | Hotmart (Club + Checkout + Webhook 2.0) | — |
| Deploy | Vercel | — |
| Fontes | Instrument Serif, Geist, JetBrains Mono | Google Fonts |

> **Nota sobre o modelo de IA (v2.0):** o `claude-opus-4-8` é o modelo mais caro do catálogo. Como o plano Básico é pagamento único (R$197) com 6 meses de mentor, recomenda-se reservar o Opus para o Premium e usar `claude-sonnet` no Básico/Clube — a estrutura de resposta do system prompt (seção 7) funciona bem em Sonnet, com custo por token significativamente menor. Ver seção 7.3.

---

## 3. Estrutura de Arquivos

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + fontes
│   │   ├── page.tsx                # Landing page (/)
│   │   ├── entrar/
│   │   │   └── page.tsx            # Login com Google (substitui /cadastro com senha)
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts        # Callback do OAuth Google (troca code por sessão)
│   │   ├── planos/
│   │   │   └── page.tsx            # Seleção de plano → checkout Hotmart
│   │   ├── aguardando/
│   │   │   └── page.tsx            # Aguardando confirmação do pagamento (estado raro)
│   │   ├── chat/
│   │   │   └── page.tsx            # Mentor IA (protegido)
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts        # POST /api/chat → Claude streaming
│   │       └── webhooks/
│   │           └── hotmart/
│   │               └── route.ts    # POST /api/webhooks/hotmart → ativação automática
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx          # Header global
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── GoogleButton.tsx    # Botão "Entrar com Google"
│   │       └── SunIcon.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase browser client
│   │   │   ├── server.ts           # Supabase server client (RSC/middleware)
│   │   │   └── admin.ts            # Service Role client (server-only, p/ webhook)
│   │   └── hotmart/
│   │       └── verify.ts           # Validação do hottok + parsing do payload 2.0
│   └── middleware.ts               # Proteção de rotas + refresh de sessão
├── .env.local
├── next.config.ts
└── package.json
```

**Principais diferenças vs v1.0:**
- `/cadastro` (registro com senha) → `/entrar` (login com Google).
- Novo `auth/callback/route.ts` (callback OAuth).
- Novo `api/webhooks/hotmart/route.ts` (ativação automática).
- Novo `lib/supabase/admin.ts` (cliente Service Role, usado **apenas** no servidor, para o webhook escrever no `profiles`).
- Novo `lib/hotmart/verify.ts` (validação de segurança do webhook).

---

## 4. Páginas e Rotas

### 4.1 `/` — Landing Page
Inalterada em relação à v1.0 (Hero, Marquee, Manifesto, Personalidade, Como funciona, Bordões, Programa, CTA, Footer). O botão de CTA leva a `/entrar`. **Acesso:** público.

### 4.2 `/entrar` — Login com Google
Substitui o antigo `/cadastro`. Apresenta um único botão **"Entrar com Google"**. Não há campos de e-mail/senha, não há modo registro/login separado — o primeiro acesso com Google já cria a conta.

Fluxo:
- Clique em "Entrar com Google" → `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- O Google autentica e redireciona para `/auth/callback`.
- Na primeira vez, um gatilho cria a linha em `profiles` com `status: 'pending'` (ver seção 6.3).
- Redireciona para `/planos` (se `pending`) ou `/chat` (se já `active`).

**Acesso:** público. Usuário já autenticado é redirecionado pelo middleware (para `/chat` se ativo, senão `/planos`).

### 4.3 `/auth/callback` — Callback OAuth (Route Handler)
Recebe o `code` do Google, troca por uma sessão Supabase (`exchangeCodeForSession`), grava os cookies de sessão e redireciona conforme o `status` do perfil. **Acesso:** público (etapa do fluxo de login).

### 4.4 `/planos` — Seleção de Plano
Apresenta os três planos. Cada card leva ao checkout da Hotmart correspondente.

| Plano | Preço | Tipo |
|---|---|---|
| Básico | R$197 à vista ou 6× R$39,90 | Pagamento único |
| Clube do Novo Líder | R$39,90/mês | Assinatura recorrente |
| Clube Premium | R$139,90/mês | Assinatura recorrente |

> **Mudança v2.0:** o banner que pedia o envio de comprovante por WhatsApp foi **removido**. A ativação agora é automática (webhook). O texto de apoio orienta o aluno a **usar o mesmo e-mail da conta Google no checkout da Hotmart** — é esse e-mail que casa a compra com a conta (ver seção 9.4). O WhatsApp permanece apenas como canal de suporte para exceções.

**Acesso:** requer autenticação.

### 4.5 `/aguardando` — Aguardando Confirmação
Tela de transição, agora um **estado raro** (só aparece se o webhook ainda não chegou — ex.: boleto não compensado, ou e-mail divergente). Exibe status "processando pagamento", botão para reabrir o checkout e link de suporte. Faz *polling* leve do `status` e redireciona para `/chat` assim que vira `active`. **Acesso:** requer autenticação.

### 4.6 `/chat` — Mentor IA
Inalterada em comportamento (sugestões de tópicos, streaming, renderização de seções e script em itálico). **Acesso:** requer autenticação **+ `status === 'active'` validado no servidor** (ver seção 5.4). Inclui botão "Acessar as aulas" que leva ao Hotmart Club.

### 4.7 `/api/chat` — Endpoint IA (POST)
Inalterado no contrato. **Adição v2.0:** antes de chamar o Claude, o handler revalida no servidor que o usuário está autenticado e `active` (não confia apenas no middleware).

```
POST /api/chat
Body: { messages: [{ role, content }], conversaId?: string }
Response: text/plain streaming (ReadableStream)
```

### 4.8 `/api/webhooks/hotmart` — Ativação Automática (POST) — **NOVO v2.0**
Route Handler que recebe os eventos da Hotmart e atualiza o `status` do aluno. Detalhado na seção 9.

```
POST /api/webhooks/hotmart
Headers/Body: payload Webhook 2.0 da Hotmart, contendo o hottok para validação
Response: 200 OK (sempre que o evento for aceito ou ignorado com segurança)
```

---

## 5. Autenticação e Controle de Acesso

### 5.1 Fluxo completo (v2.0)

```
Usuário → /entrar → "Entrar com Google"
        ↓
   Google OAuth → /auth/callback → sessão Supabase criada (cookies)
        ↓
   (1ª vez) trigger cria profiles { status: 'pending' }
        ↓
   → /planos → checkout Hotmart (mesmo e-mail do Google)
        ↓
   Pagamento aprovado na Hotmart
        ↓
   Hotmart → POST /api/webhooks/hotmart  (automático, sem humano)
        ↓
   valida hottok → match por e-mail → UPDATE profiles SET status='active'
        ↓
   Usuário acessa /chat ✓   (sem novo login: sessão longa)
        ↓
   Conteúdo (vídeos/PDFs) no Hotmart Club, acessível pelo botão "Acessar as aulas"
```

A diferença essencial em relação à v1.0: **não há mais "Admin confirma pagamento" nem `UPDATE manual`**. O passo humano foi substituído pelo webhook.

### 5.2 Distinção crítica: Acesso ≠ Sessão

Dois mecanismos independentes governam a entrada do aluno e **não devem ser confundidos**:

- **Acesso (autorização):** *se* a pessoa tem direito de usar o mentor. Governado por `profiles.status`, escrito **somente** pelo webhook (server-side, Service Role).
- **Sessão (autenticação):** *quem* é a pessoa neste navegador. Governado pelo Supabase Auth via Google OAuth, com sessão de longa duração (refresh token).

O webhook libera a porta; o login com Google é a pessoa provando a identidade ao passar por ela. Por isso, ao voltar do Hotmart Club para o mentor, **não há novo pedido de senha** — a sessão Google já está ativa no navegador (ver seção 5.5).

### 5.3 Middleware (`src/middleware.ts`)

| Rota | Condição | Ação |
|---|---|---|
| `/chat/*` | Não autenticado | Redirect → `/entrar` |
| `/chat/*` | Autenticado, `status !== 'active'` | Redirect → `/aguardando` |
| `/planos/*` | Não autenticado | Redirect → `/entrar` |
| `/entrar` | Autenticado e `active` | Redirect → `/chat` |
| `/entrar` | Autenticado e `pending` | Redirect → `/planos` |
| (todas) | — | Refresh silencioso da sessão Supabase |

### 5.4 Defesa em profundidade no `/api/chat`
O middleware é conveniência de UX, **não** fronteira de segurança. O endpoint `/api/chat` revalida no servidor, a cada requisição: (a) sessão válida e (b) `profiles.status === 'active'` e não expirado (seção 6). Sem isso, alguém poderia chamar a API diretamente, contornando o middleware.

### 5.5 Sessão longa (experiência de "um clique")
O Supabase mantém a sessão via refresh token por semanas/meses. Resultado prático: o aluno faz login com Google **uma vez** (logo após a compra, quando está mais engajado); nas visitas seguintes, o botão "Falar com seu mentor" dentro do Club o leva ao `/chat` já autenticado, sem qualquer senha. O middleware renova a sessão a cada navegação.

### 5.6 Por que não há SSO "invisível" entre Hotmart e plataforma
A Hotmart **não** oferece um fluxo de identidade federada (OAuth/SSO) do Club para ferramentas externas. A integração disponível é o webhook (acesso), não a sessão. Logo, um trânsito 100% sem ação entre os dois ambientes não é possível mantendo o conteúdo na Hotmart. O login com Google torna esse atrito **mínimo e único** (primeiro acesso). Unificação total só seria viável hospedando também o conteúdo na própria plataforma (ver seção 9.5, descartada para o MVP).

---

## 6. Banco de Dados (Supabase)

### 6.1 Tabela `profiles` (atualizada v2.0)

```sql
create table profiles (
  id                   uuid references auth.users primary key,
  email                text not null,
  nome                 text,
  plano                text,          -- 'basico' | 'clube' | 'premium' | null
  status               text not null default 'pending',  -- 'pending' | 'active' | 'inactive'
  acesso_expira_em     timestamptz,   -- p/ plano Básico (6 meses) e controle de assinatura
  hotmart_subscriber_code text,        -- código único da assinatura (recorrência)
  hotmart_transaction  text,           -- última transação processada (auditoria)
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);
```

**Novos campos vs v1.0:**
- `status` ganha o valor `'inactive'` (para cancelamento/reembolso/expiração).
- `acesso_expira_em` — controla os 6 meses do Básico e o vencimento de assinatura.
- `hotmart_subscriber_code` — vincula a assinatura para reagir a cancelamentos.
- `hotmart_transaction` — auditoria e idempotência.

### 6.2 Row Level Security (RLS) — **corrigida v2.0**

```sql
alter table profiles enable row level security;

-- Leitura: apenas o próprio perfil
create policy "leitura própria"
  on profiles for select
  using (auth.uid() = id);

-- Inserção: apenas o próprio perfil (na criação via trigger/login)
create policy "inserção própria"
  on profiles for insert
  with check (auth.uid() = id);

-- ⚠️ NÃO existe policy de UPDATE para o usuário comum.
-- Sem policy de update, o aluno NÃO pode alterar nenhuma coluna do próprio perfil
-- (em especial, não pode se autoativar mudando status para 'active').
-- A ativação ocorre SOMENTE pelo webhook, que usa a Service Role Key
-- (a Service Role ignora RLS por definição e roda apenas no servidor).
```

**Falha corrigida:** na v1.0 não havia bloqueio explícito de `update` do `status`. Dependendo de como o cliente chamasse o Supabase, um aluno poderia tentar se autoativar. Na v2.0, a ausência de policy de update fecha isso, e a única escrita de `status` vem do servidor (webhook).

### 6.3 Criação automática do perfil (trigger)
Como o login agora é OAuth (sem formulário de cadastro), o perfil é criado por um trigger no `auth.users`:

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, nome, status)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'pending')
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 6.4 (Opcional) Persistência de conversas
Recomendado, não obrigatório para o MVP. Hoje o histórico do chat vive apenas no browser e se perde ao trocar de dispositivo — perda de valor para um "mentor de bolso". Tabelas sugeridas:

```sql
create table conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  titulo text,
  created_at timestamptz default now()
);
create table mensagens (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid references conversas not null,
  role text not null,        -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz default now()
);
-- RLS por usuário em ambas (using auth.uid() = user_id / via join na conversa).
```

---

## 7. Integração com IA (Claude)

### 7.1 System Prompt
Mantido da v1.0. **Identidade:** direto, leve, prático, humano; sem jargão corporativo.

**Estrutura obrigatória de resposta:**
1. **Cenário** — contexto da situação
2. **Causa provável** — hipótese do comportamento
3. **O que fazer** — lista de 3–5 ações
4. *"Script pronto"* — frase copiável em itálico
5. **O que evitar** — 2–3 comportamentos
6. **Próximo passo** — ação concreta e imediata

**Guardrails:** questões jurídicas/trabalhistas → redireciona para RH/jurídico; situações vagas → 2–3 perguntas antes de responder; nunca diagnostica psicologicamente liderados.

### 7.2 Streaming
Resposta via `ReadableStream` (`text/plain`), lida no frontend com `getReader()` e renderizada incrementalmente.

### 7.3 Modelo por plano e controle de custo — **NOVO v2.0**
- **Básico / Clube:** `claude-sonnet` (mesma estrutura de resposta, custo por token bem menor).
- **Premium:** `claude-opus-4-8`.
- **Instrumentação obrigatória:** registrar consumo por aluno desde o dia 1 (tokens in/out por requisição). Como o Básico é pagamento único com 6 meses de mentor, um aluno engajado pode consumir parte relevante da receita em IA.
- **Limite amigável:** teto configurável de mensagens/dia por plano, com mensagem cordial ao atingir, para proteger a margem sem prejudicar a experiência típica.

### 7.4 Coexistência com o Hotmart Tutor
O **Hotmart Tutor** (assistente nativo do Club, treinado no conteúdo das aulas) atende dúvidas *sobre o curso* dentro da sala de aula. O **mentor da plataforma** atende situações *de liderança* com script pronto. São papéis distintos e complementares; não há sobreposição que justifique abrir mão do mentor próprio (que é o diferencial do produto). Requisitos do Tutor, caso seja habilitado: curso no Hotmart Club, vídeos com áudio em PT/ES/EN no Player da Hotmart e legendas ativas.

---

## 8. Design System
Inalterado em relação à v1.0 (paleta sol/amanhecer/creme/café; tipografia Instrument Serif + Geist + JetBrains Mono; componentes Card, Button, SunIcon, Header). **Adição:** componente `GoogleButton` para o login (botão com o ícone do Google seguindo as diretrizes de marca do Google Sign-In).

---

## 9. Integração Hotmart (Pagamento + Conteúdo) — **NOVO/REVISADO v2.0**

### 9.1 Papel da Hotmart na arquitetura
- **Checkout:** processa o pagamento dos três planos.
- **Conteúdo (Hotmart Club):** hospeda videoaulas e PDFs, com player protegido, certificado, acesso mobile e (opcional) o Tutor. Evita reconstruir infraestrutura de vídeo/antipirataria.
- **Webhook 2.0:** notifica a plataforma a cada evento de transação para ativar/desativar o acesso automaticamente.

A **plataforma própria** é a casa do **mentor situacional** (o `/chat`) e da vitrine (landing + planos).

### 9.2 Webhook — eventos e processamento

Eventos a assinar na configuração do Webhook (Hotmart → Ferramentas → Webhook/API e notificações):

| Evento | Ação no `profiles` |
|---|---|
| `PURCHASE_APPROVED` / `PURCHASE_COMPLETE` | `status = 'active'`; define `plano` e `acesso_expira_em` (Básico: +6 meses) |
| `PURCHASE_REFUNDED` / `PURCHASE_CHARGEBACK` | `status = 'inactive'` |
| `SUBSCRIPTION_CANCELLATION` | `status = 'inactive'` (ou ao fim do ciclo vigente, conforme regra de negócio) |
| `PURCHASE_DELAYED` / aguardando pagamento (boleto) | mantém `pending`; aluno vê `/aguardando` |

Campos relevantes do payload 2.0 (`data`): `buyer.email`, `purchase.status`, `purchase.transaction`, `subscription.subscriber.code`, `subscription.status`, `product.id`, `offer.code`.

### 9.3 Segurança do webhook (obrigatória)
1. **Validação do hottok:** a Hotmart envia um token único da conta; o handler compara com `HOTMART_HOTTOK` (env). Requisição sem o hottok correto → `401`, sem processar.
2. **Idempotência:** registrar `purchase.transaction` em `hotmart_transaction` (ou tabela de eventos) e ignorar repetições. A Hotmart **reenvia até 5 vezes** em caso de falha e guarda histórico por 60 dias — sem idempotência, retries causam ativação duplicada.
3. **Responder 200 rápido:** se a URL retornar erro, a Hotmart **desativa automaticamente** a configuração de webhook. Processar de forma enxuta (ou enfileirar) e responder 200 imediatamente.
4. **Match por e-mail:** localizar o `profiles` pelo `buyer.email`. Se não existir (compra antes do login), **criar a linha já `active`** e instruir, no onboarding, o uso do mesmo e-mail do Google.

### 9.4 Regra do e-mail único
O elo entre a compra (Hotmart) e a conta (Google/Supabase) é o **e-mail**. Por isso:
- A tela `/planos` instrui o aluno a usar, no checkout da Hotmart, o **mesmo e-mail da conta Google**.
- Se houver divergência, o webhook não acha o perfil: trata-se como pré-cadastro `active` por e-mail; ao logar com Google nesse mesmo e-mail, o trigger faz `on conflict do nothing` e o acesso já está liberado. Divergência real de e-mails é resolvida pelo suporte (WhatsApp).

### 9.5 Pontes entre os dois ambientes (sem SSO)
- Na **plataforma**: botão "Acessar as aulas" → leva ao Hotmart Club.
- No **Club**: usar um bloco de texto/anúncio com botão "Falar com seu mentor" → leva ao `/chat`. Como a sessão Google é longa, o aluno chega autenticado.
- **Por que não embutir o chat dentro do Club:** a sala de aula do Club não oferece componente confiável de iframe/HTML externo (ao contrário do Hotmart Pages, usado em páginas de venda). A Hotmart espera que ferramentas próprias vivam fora e sejam integradas por webhook. Portanto, mantém-se o mentor na plataforma, com pontes por botão.
- **Alternativa descartada para o MVP:** hospedar vídeos/PDFs na própria plataforma (player externo tipo Mux/Vimeo + Supabase Storage) para unificar tudo e dar contexto de aula ao mentor. Reconstrói player/antipirataria/certificado/mobile — esforço alto antes de validar a venda. Reavaliar se "mentor consciente da aula atual" virar o coração do produto.

---

## 10. Variáveis de Ambiente

```env
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (públicas — browser)
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase (server-only — NUNCA expor no browser)
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # usada só no webhook (lib/supabase/admin.ts)

# Hotmart
HOTMART_HOTTOK=...                       # token de validação do webhook

# Google OAuth (configurado no painel do Supabase Auth → Providers → Google)
# Client ID / Secret ficam no Supabase, não no código.
```

> A Service Role Key concede acesso total ao banco e ignora RLS. Deve existir **apenas** em ambiente de servidor (Vercel server env) e ser usada exclusivamente no handler do webhook. Nunca em `NEXT_PUBLIC_*`.

---

## 11. Deploy

Plataforma: **Vercel** (configuração padrão Next.js).
- Branch `master` → produção automática.
- Variáveis de ambiente no painel da Vercel (separar as `NEXT_PUBLIC_*` das server-only).
- Edge Middleware habilitado para `middleware.ts`.
- **Google OAuth:** registrar a URL de produção e a `…/auth/callback` como Authorized redirect URI no Google Cloud Console e no Supabase.
- **Webhook Hotmart:** cadastrar `https://SEU_DOMINIO/api/webhooks/hotmart` na Hotmart, assinando os eventos da seção 9.2.

---

## 12. Itens Pendentes / Próximos Passos (atualizado v2.0)

| Item | Status | Prioridade |
|---|---|---|
| Criar projeto no Supabase e preencher env vars | Pendente | Alta |
| Rodar SQL de `profiles` (com campos novos) + trigger + RLS corrigida | Pendente | Alta |
| Configurar Google OAuth (Supabase + Google Cloud Console) | Pendente | Alta |
| Implementar `/api/webhooks/hotmart` (hottok, idempotência, eventos) | Pendente | **Alta** (era "Futuro") |
| Criar produtos na Hotmart e cadastrar o webhook | Pendente | Alta |
| Instrumentar consumo de IA por aluno + limite diário | Pendente | Média |
| Selecionar modelo por plano (Sonnet/Opus) | Pendente | Média |
| Persistir conversas no Supabase (seção 6.4) | Futuro | Média |
| Habilitar Hotmart Tutor no Club (dúvidas de conteúdo) | Futuro | Baixa |
| Dashboard admin (visão de alunos/assinaturas) | Futuro | Baixa |
| Analytics (PostHog ou similar) | Futuro | Baixa |

**Removidos da v1.0** (não fazem mais sentido): "Automatizar ativação via webhook" (agora é MVP, não futuro) e "Ativação manual via Supabase Dashboard" (substituída pelo webhook).

---

## 13. Contato e Suporte
WhatsApp de suporte: **(11) 97466-8867** (agora só exceções — divergência de e-mail, dúvidas).
Instagram: `@acordeivireilider`

---

## 14. Resumo das mudanças v1.0 → v2.0

| Tema | v1.0 | v2.0 |
|---|---|---|
| Ativação de acesso | Comprovante por WhatsApp + UPDATE manual no Supabase | Webhook Hotmart → ativação automática |
| Login | E-mail + senha (`/cadastro`) | Google OAuth (`/entrar`), sessão longa |
| Volta do conteúdo ao mentor | Pediria senha | Sem senha (sessão Google ativa) |
| RLS | Sem bloqueio de update do `status` | Sem policy de update → aluno não se autoativa |
| Validação de acesso no chat | Só middleware | Middleware + revalidação server-side |
| Expiração / cancelamento | Não modelado | `acesso_expira_em` + `subscriber_code` + eventos |
| Custo de IA | Opus para todos | Sonnet no Básico/Clube, Opus no Premium + limites |
| Conteúdo (vídeos/PDFs) | "Hotmart, por e-mail" | Hotmart Club, com botão de ponte |

---

*Documento gerado em 15/06/2026. Atualizar a cada mudança estrutural relevante.*
