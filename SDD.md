# SDD — Mentor do Novo Líder
**"Seu Mentor em qualquer lugar" · Consultoria Acordei, virei Líder**
**Software Design Document · v1.0 · 09 de junho de 2026 · Confidencial**

---

## Histórico de versões

| Versão | Data       | Autor            | Descrição                                         |
|--------|------------|------------------|---------------------------------------------------|
| 1.0    | 09/06/2026 | Equipe de Produto | Versão inicial — SDD + brand guideline integrados |

---

## Resumo executivo

Assistente conversacional especializado em gestão de pessoas para líderes recém-promovidos. Decisões-chave validadas: canal = app web/mobile próprio; abordagem = híbrida (MVP sólido evoluindo para custom); conhecimento = RAG com banco vetorial; identidade visual = brand guideline "Acordei, virei Líder" v1.0.

---

## 1. Visão do produto

### 1.1 Problema

Profissionais tecnicamente excelentes são promovidos a líderes da noite para o dia — sem repertório de gestão de pessoas. Enfrentam, sozinhos e sob pressão: feedback difícil, cobrança de prazos, conflitos, desengajamento. **84% dos profissionais que pedem demissão citam o relacionamento com o gestor direto.**

Treinamentos formais são caros, pontuais e desconectados do problema real que o líder tem *agora*.

### 1.2 Proposta de valor

> "Seu mentor de liderança, no bolso, 24/7."

O líder descreve a situação real → recebe orientação prática, humana e aplicável imediatamente, com script pronto do que falar e próximo passo. Direto, leve, sem jargão de consultoria.

**Diferenciais:**
- Tom de voz e metodologia proprietários da consultoria
- Estrutura de resposta padronizada e acionável
- Biblioteca de 30+ scripts copiáveis
- Guardrails que protegem o líder e a empresa de riscos éticos/legais
- Sempre recomenda o RH quando necessário

### 1.3 Personas

| Persona | Contexto | Dores | O que espera |
|---|---|---|---|
| **Ana** — Líder recém-promovida | Era a melhor técnica; lidera 4 pessoas há 2 meses | Insegurança para dar feedback; medo de conflito; síndrome do impostor | Respostas rápidas e seguras, com o que falar |
| **Rafael** — Líder sob pressão | Lidera há 1 ano; herdou liderado de baixa performance | Falta de tempo; receio de errar; ansiedade | Passo a passo objetivo e quando acionar o RH |
| **Consultoria (admin)** | Equipe "Acordei, virei Líder" mantém o conteúdo | Garantir fidelidade ao método e atualizar com segurança | Painel para curar conteúdo sem depender de TI |
| **RH/BP (B2B futuro)** | Compra licenças para escalar desenvolvimento de líderes | Padronizar cultura, reduzir turnover | Relatórios agregados e anônimos |

### 1.4 Jornadas

**Principal — "Tenho um problema agora":**
Abre o app → descreve a situação → agente faz 1–3 perguntas de contexto → entrega resposta estruturada (cenário, causa, o que fazer, script, o que evitar, próximo passo) → líder copia o script → agente sugere check-in.

**Aprendizado — "Quero me preparar":**
Navega por temas (feedback, conflito, alta performance, carreira) → acessa conteúdos e scripts mesmo sem problema imediato.

**Acompanhamento:**
Agente registra combinados → na próxima sessão retoma o contexto ("como foi aquela conversa de feedback?").

---

## 2. Escopo

### Dentro do MVP
- Conversa orientada por contexto
- Base de conhecimento curada (Lencioni, SCI, CNV, 70/20/10, 30+ scripts)
- Histórico por usuário
- Guardrails de risco ético/legal
- Recomendação de envolver o RH

### Fora do escopo (inicial)
- Integração com sistemas de RH corporativos
- Avaliações de desempenho automatizadas
- Aconselhamento jurídico
- Recomendação direta de demissão

---

## 3. Requisitos funcionais

| ID | Requisito | Prioridade | Fase |
|---|---|---|---|
| RF-01 | Conversa em linguagem natural com tom e regras de atendimento definidos | Alta | MVP |
| RF-02 | Agente faz 1–3 perguntas de contexto antes de aconselhar | Alta | MVP |
| RF-03 | Respostas na estrutura padrão (cenário, causa, o que fazer, script, o que evitar, próximo passo) | Alta | MVP |
| RF-04 | Scripts prontos copiáveis | Alta | MVP |
| RF-05 | Busca semântica (RAG) sobre a base de conhecimento | Alta | MVP |
| RF-06 | Guardrails: risco ético/legal → RH; nunca aconselhar demissão nem dar parecer jurídico | Alta | MVP |
| RF-07 | Autenticação de usuário + histórico de conversas por líder | Alta | MVP |
| RF-08 | Biblioteca navegável de temas e scripts | Média | MVP |
| RF-09 | Onboarding inicial (tamanho do time, tempo de casa, cultura) | Média | MVP |
| RF-10 | Painel admin para curadoria de conteúdo sem código | Média | Fase 2 |
| RF-11 | Check-ins: retomar combinados em sessões futuras | Média | Fase 2 |
| RF-12 | App mobile nativo (iOS/Android) | Média | Fase 2 |
| RF-13 | Relatórios agregados e anônimos para clientes B2B (RH) | Baixa | Fase 3 |

---

## 4. Requisitos não funcionais

| ID | Categoria | Critério |
|---|---|---|
| RNF-01 | Desempenho | Primeira resposta percebida ≤ 3s (streaming token a token) |
| RNF-02 | Disponibilidade | Uptime 99,5%; degradação graciosa se LLM indisponível |
| RNF-03 | Escalabilidade | Backend stateless; LLM e banco vetorial como serviços escaláveis |
| RNF-04 | Segurança | TLS em trânsito; criptografia em repouso; JWT; segredos em cofre |
| RNF-05 | LGPD | Consentimento, minimização de dados, direito ao esquecimento, DPO |
| RNF-06 | Usabilidade | Mobile-first; linguagem simples; WCAG 2.1 AA |
| RNF-07 | Fidelidade ao método | Aderência ao tom e metodologia; avaliação contínua |
| RNF-08 | Observabilidade | Logs, métricas, rastreamento de conversas (anonimizáveis) |
| RNF-09 | Portabilidade de LLM | Abstração de provedor para trocar/combinar modelos sem reescrever |
| RNF-10 | Custo | Controle de custo por conversa (limites de tokens, cache, modelos certos) |

---

## 5. Arquitetura da solução

### 5.1 Abordagem híbrida — justificativa

MVP com serviços gerenciados (LLM via API, banco vetorial gerenciado, auth pronto) para lançar em semanas, com fronteiras bem definidas: orquestrador, serviço de RAG e guardrails como módulos separados. Conforme o produto valida e escala, cada módulo é substituído por versão customizada de forma incremental.

### 5.2 Componentes

| Componente | Responsabilidade |
|---|---|
| **App (cliente)** | Interface de chat mobile-first (PWA na Fase 1 → nativo na Fase 2). Onboarding, histórico e biblioteca de scripts |
| **API Gateway + Auth** | Ponto de entrada único; JWT, rate limiting e roteamento |
| **Orquestrador do agente** | Gerencia o estado da conversa, decide quando perguntar contexto, chama o RAG, aplica prompt do sistema e guardrails, formata resposta |
| **Serviço de RAG** | Recebe a pergunta, gera embedding, busca trechos relevantes no banco vetorial, devolve contexto curado |
| **Guardrails & moderação** | Classifica risco ético/legal, bloqueia aconselhamento jurídico/demissão, injeta recomendação de acionar o RH |
| **LLM** | Gera a resposta a partir de: prompt do sistema + contexto RAG + histórico. Provedor abstraído |
| **Banco vetorial** | Armazena embeddings da base de conhecimento; busca por similaridade |
| **PostgreSQL + storage** | Usuários, sessões, histórico, documentos-fonte, logs/analytics |
| **Painel admin + ingestão** | Permite à consultoria curar conteúdo; dispara pipeline de chunking → embeddings → indexação |

### 5.3 Fluxo de uma conversa

```
Líder descreve a situação
        ↓
Orquestrador coleta contexto (1–3 perguntas)
        ↓
Serviço de RAG: embedding da pergunta → busca banco vetorial → retorna k trechos
        ↓
Guardrails: analisa risco ético/legal
        ↓ (se ok)
LLM: prompt do sistema + contexto RAG + histórico → gera resposta estruturada
        ↓
Resposta na estrutura padrão + script copiável
        ↓
Agente registra combinado + sugere check-in
```

---

## 6. Estratégia de conhecimento (RAG)

### 6.1 Decisão técnica

| Abordagem | Prós | Contras |
|---|---|---|
| Tudo no prompt do sistema | Simples; ótimo para conteúdo pequeno e estável | Não escala; estoura limite de contexto; caro; difícil atualizar |
| **RAG com banco vetorial ✓** | Escala com a base; busca só o relevante; curadoria sem código; rastreável | Exige pipeline de ingestão e infra de busca |

> **Decisão:** RAG desde o MVP. Tom de voz e regras ficam no prompt do sistema (estáveis e curtos). Todo conteúdo metodológico vai para o banco vetorial.

### 6.2 Pipeline de ingestão

1. **Curadoria** — consultoria revisa e versiona o conteúdo no painel admin
2. **Chunking** — conteúdo dividido em trechos semânticos por tema/seção com metadados (tema, tipo: conceito/script/ação)
3. **Embeddings** — cada trecho convertido em vetor
4. **Indexação** — vetores e metadados gravados no banco vetorial
5. **Versão e rollback** — cada publicação gera uma versão; possível reverter

### 6.3 Prompt do sistema — estrutura

**Persona e tom:** Mentor + amigo experiente; direto, leve, prático, humano; frases curtas; sem jargão acadêmico.

**Léxico permitido:** `feedback` · `alinhamento` · `combinado` · `clareza` · `postura` · `autonomia` · `cobrança` · `rotina` · `conversas difíceis` · `maturidade` · `respeito` · `faz assim:`

**Léxico proibido:** ~~sinergia~~ · ~~mindset disruptivo~~ · ~~empowerment~~ · ~~jornada transformacional~~ · ~~unleash~~ · ~~stakeholder mindset~~ · ~~protagonismo~~ · ~~soft skills 4.0~~ · ~~people-first~~

**Regras de atendimento:** perguntar contexto antes de aconselhar; nunca julgar; sem linguagem jurídica; não aconselhar demissão; reduzir ansiedade com objetividade; risco ético/legal → RH.

**Estrutura de resposta obrigatória:**
1. Cenário
2. Causa provável
3. O que fazer (passo a passo)
4. O que falar (script copiável)
5. O que evitar
6. Próximo passo / check-in

---

## 7. Modelo de dados

| Entidade | Campos principais | Observações |
|---|---|---|
| `Usuario` | id, nome, email, papel, criado_em, consentimento_lgpd | Email é dado pessoal |
| `PerfilLideranca` | usuario_id, tamanho_time, tempo_na_funcao, cultura_empresa, temas_interesse | Captado no onboarding |
| `Sessao` | id, usuario_id, iniciada_em, canal | Uma conversa/atendimento |
| `Mensagem` | id, sessao_id, autor (user/agente), conteudo, criada_em, trechos_rag | Histórico; trechos_rag para rastreabilidade |
| `Combinado` | id, usuario_id, descricao, prazo, status | Suporta check-ins |
| `DocumentoFonte` | id, titulo, tema, versao, conteudo | Conteúdo curado da consultoria |
| `TrechoVetor` | id, documento_id, texto, embedding, metadados | Unidade indexada no banco vetorial |
| `LogQualidade` | id, sessao_id, avaliacao, flag_risco, custo_tokens | Observabilidade e melhoria contínua |

> **Nota LGPD:** histórico de conversas pode conter relatos sensíveis sobre terceiros (liderados). Separamos identidade (`Usuario`) do conteúdo (`Mensagem`), permitimos anonimização para analytics e suportamos exclusão sob demanda.

---

## 8. Stack tecnológico

| Camada | Recomendação | Por quê |
|---|---|---|
| Frontend | React (PWA) → React Native / Expo (Fase 2) | Reaproveita código e time; um caminho para nativo |
| Backend / API | Node.js (NestJS) ou Python (FastAPI) | Ecossistema maduro de IA; stateless e escalável |
| LLM | API gerenciada — **Claude** (Anthropic) com abstração de provedor | Qualidade de ponta sem operar modelos; troca sem reescrever |
| Embeddings | Modelo gerenciado (ex: text-embedding-3 / Claude embeddings) | Qualidade de busca semântica com baixo custo operacional |
| Banco vetorial | pgvector no PostgreSQL (MVP) → Pinecone/Qdrant se escalar | pgvector unifica dados e vetores no MVP |
| Banco relacional | PostgreSQL | Confiável, suporta pgvector, amplamente conhecido |
| Autenticação | Clerk ou Supabase Auth (JWT/OAuth) | Segurança pronta; acelera o MVP |
| Infra / Deploy | Docker + Vercel (web) / Railway ou Fly.io (backend) | Portável, escalável, custo previsível |
| Observabilidade | Langfuse ou LangSmith (tracing de LLM) + Sentry | Qualidade, custo e depuração de conversas |

### Fontes web
```html
<link href="https://fonts.googleapis.com/css2?
  family=Instrument+Serif:ital@0;1
  &family=Geist:wght@300;400;500;600;700
  &family=JetBrains+Mono:wght@400;500
  &display=swap" rel="stylesheet"/>
```

---

## 9. Identidade visual (Design System)

### 9.1 Tokens de cor
```css
:root {
  --sol:        #E8552D;   /* primária · terra · 16% */
  --sol-soft:   #FF6F45;
  --amanhecer:  #F4A03A;   /* apoio · âmbar · 4% */
  --pessego:    #FFD8B5;   /* apoio suave */
  --creme:      #FFF4E8;   /* fundo · respiro · 50% */
  --linho:      #F8E8D4;   /* superfície · 8% */
  --brasa:      #8E2E18;   /* pontual */
  --cafe:       #2A1A14;   /* texto autoridade · 22% */
  --cafe-2:     #5A4439;   /* texto secundário */
  --cafe-3:     #8A7468;   /* texto terciário / areia */
  --linha:      rgba(42,26,20,0.12);
  --linha-soft: rgba(42,26,20,0.06);

  --serif: "Instrument Serif", "Times New Roman", serif;
  --sans:  "Geist", system-ui, sans-serif;
  --mono:  "JetBrains Mono", ui-monospace, monospace;

  --radius-card:   28px;
  --radius-button: 999px;
  --radius-chip:   999px;
}
```

**Proporção de uso:** Creme 50% · Café 22% · Sol 16% · Linho 8% · Âmbar 4%

### 9.2 Escala tipográfica
| Nível | Fonte | Tamanho / line-height |
|---|---|---|
| H1 | Instrument Serif Italic | 96px / 0.96 |
| H2 | Instrument Serif Italic | 64px / 1 |
| H3 | Instrument Serif Italic | 40px / 1.05 |
| Lede | Geist 300 | 22px / 1.55 |
| Body | Geist 400 | 16px / 1.6 |
| Mono/Label | JetBrains Mono 500 | 11px / 0.22em uppercase |

### 9.3 Componentes base
```
card              → border-radius: 28px · padding: 40px · border: 1px solid var(--linha-soft)
card--linen       → background: var(--linho)
card--cafe        → background: var(--cafe) · color: var(--creme)
card--sol         → background: var(--sol) · color: var(--creme)
card--amber       → background: var(--amanhecer) · color: var(--cafe)
card--brasa       → background: var(--brasa) · color: var(--creme)

chip--yes         → background: var(--pessego) · color: var(--brasa) · radius: 999px
chip--no          → transparente · borda dashed · line-through

button-primary    → background: var(--cafe) · color: var(--creme) · radius: 999px
button-cta        → background: var(--sol) · color: var(--creme) · radius: 999px
```

### 9.4 Símbolo / Logo
- **Símbolo:** sol meio nascendo sobre horizonte (SVG inline)
- **Wordmark:** "acordei, virei líder." — Instrument Serif Italic
- **Monograma:** `a.` em serif italic

**Regras invioláveis:** nunca bold · sem gradientes · não rotacionar · não deformar · área de proteção = altura do "a" minúsculo

---

## 10. Guardrails e qualidade

### 10.1 Guardrails

| Situação | Comportamento |
|---|---|
| Risco ético/legal (assédio, discriminação) | Acolhe, não julga, orienta postura e direciona ao RH. Nunca dá parecer jurídico |
| Pedido de aconselhar demissão | Não aconselha; foca em plano de performance e acionar o RH |
| Usuário ansioso/nervoso | Reduz ansiedade com orientação objetiva e passo a passo |
| Fora de escopo (assunto pessoal/terapêutico) | Redireciona com gentileza; sugere apoio especializado |
| Conteúdo sem respaldo na base | Sinaliza incerteza; sugere validar com RH |

### 10.2 Avaliação contínua
Conjunto de casos de teste com perguntas reais e respostas de referência. A cada mudança de prompt ou base: mede aderência ao tom, presença da estrutura padrão e acionamento correto dos guardrails. Feedback 👍/👎 alimenta melhoria contínua.

### 10.3 Exemplo de resposta padrão
```
Cenário: liderado entrega bem, mas reclama com frequência.

Causa provável: pode ser um padrão pessoal ou estímulo do contexto.

O que fazer: traga o fato, reconheça a entrega, nomeie o comportamento,
busque consciência antes do ajuste.

O que falar (script):
"Quero conversar sobre um ponto delicado com respeito e clareza.
Tenho percebido que, quando trazemos uma nova demanda, costuma vir
uma reclamação. Você percebe isso também? Como podemos ajustar juntos?"

O que evitar: rotular a pessoa ("você é negativo") ou dar o feedback
no calor da emoção.

Próximo passo: combinar check-in em duas semanas para revisar o combinado.
```

---

## 11. Segurança e LGPD

- **TLS** em trânsito; criptografia em repouso para dados e backups
- **JWT** com expiração de sessão; menor privilégio no acesso interno
- **Segredos** em cofre (nunca no código)
- **Rate limiting** e proteção contra prompt injection na borda
- **Consentimento** explícito no onboarding com finalidade clara (LGPD)
- **Minimização:** evitar identificar liderados por nome quando possível
- **Direitos do titular:** acesso, correção e exclusão self-service
- **Retenção:** política de anonimização do histórico após período definido
- **LLM:** preferir provedores com cláusula de não treinamento sobre os dados enviados

---

## 12. UX — princípios de interface

- **Mobile-first e conversacional** — o líder fala como falaria com um mentor
- **Streaming** — texto aparece em tempo real para reduzir sensação de espera
- **Script copiável com um toque** — em destaque na resposta
- **Biblioteca por temas** — feedback, conflito, performance, delegação, carreira
- **Próximo passo sempre visível** — desenvolvimento é cadência, não evento
- **Tom visual** — fundo creme, tipografia serif italic, energia no sol (#E8552D)

---

## 13. Roadmap de implementação

| Fase | Objetivo | Entregas | Prazo alvo |
|---|---|---|---|
| **Fase 0 — Fundação** | Preparar base e conteúdo | Curadoria/chunking da base; prompt do sistema v1; setup de infra e ambientes | 2–3 semanas |
| **Fase 1 — MVP** | Validar valor com líderes reais | App web (PWA), chat com RAG, guardrails, auth, histórico, biblioteca de scripts | 6–8 semanas |
| **Fase 2 — Expansão** | Aprofundar engajamento | Painel admin, check-ins/acompanhamento, app mobile nativo, melhorias de qualidade | +8–10 semanas |
| **Fase 3 — Escala / B2B** | Escalar e monetizar | Relatórios agregados anônimos para RH, multi-tenant, integrações, otimização de custo | +10–12 semanas |

**Critério de transição:** só substitui componente gerenciado por customizado quando houver evidência de uso/escala que justifique. Evitar engenharia prematura.

### Sprints sugeridos (Fase 1 detalhado)

**Sprint 0 (Setup — 1 semana)**
- [ ] Repositório + monorepo
- [ ] Design system: tokens CSS, componentes base, fontes
- [ ] Setup PostgreSQL + pgvector + auth
- [ ] Pipeline de ingestão de documentos (chunking + embeddings)

**Sprint 1 (Onboarding + Chat base — 2 semanas)**
- [ ] Tela de onboarding (perfil do líder)
- [ ] Interface de chat com streaming
- [ ] Integração LLM (Claude via API) + prompt do sistema v1
- [ ] RAG básico (busca vetorial + injeção no contexto)

**Sprint 2 (Guardrails + Estrutura de resposta — 1 semana)**
- [ ] Módulo de guardrails (risco ético/legal → RH)
- [ ] Estrutura de resposta padrão (cenário, causa, script, próximo passo)
- [ ] Scripts copiáveis com um toque
- [ ] Avaliação 👍/👎 por resposta

**Sprint 3 (Biblioteca + Histórico — 1 semana)**
- [ ] Biblioteca navegável por temas
- [ ] Histórico de conversas por usuário
- [ ] Registro de combinados

**Sprint 4 (Qualidade + Deploy — 1 semana)**
- [ ] Suite de casos de teste de qualidade
- [ ] Observabilidade (Langfuse / tracing + custo por conversa)
- [ ] Deploy em produção + domínio
- [ ] Piloto com grupo de líderes reais

---

## 14. Métricas e KPIs

| Categoria | Métrica | Meta inicial |
|---|---|---|
| Ativação | % de líderes com 1ª conversa completa | ≥ 70% |
| Engajamento | Conversas por líder ativo / mês | ≥ 4 |
| Retenção | Líderes ativos em 30 dias | ≥ 40% |
| Valor percebido | % de respostas avaliadas como úteis (👍) | ≥ 85% |
| Qualidade | Aderência ao tom e estrutura padrão | ≥ 90% |
| Segurança | Acionamento correto de guardrails em risco | 100% |
| Desempenho | Tempo até primeira resposta (streaming) | ≤ 3s |
| Custo | Custo médio de LLM por conversa | Dentro do orçamento |

---

## 15. Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Respostas fora do tom/método (alucinação) | Alto | RAG + prompt rígido + avaliação contínua + feedback dos usuários |
| Risco legal/ético em conselhos sensíveis | Alto | Guardrails, limite de escopo claro, direcionamento ao RH, revisão jurídica |
| Vazamento de dados sensíveis | Alto | Criptografia, LGPD by design, provedor de LLM sem treinamento nos dados |
| Custo de LLM acima do previsto | Médio | Modelos certos por tarefa, cache de contexto, limites de tokens, monitoramento |
| Dependência de um único provedor de LLM | Médio | Abstração de provedor; possibilidade de troca/fallback |
| Baixa adoção pelos líderes | Médio | UX mobile-first, onboarding leve, valor imediato, scripts copiáveis |
| Conteúdo desatualizado | Baixo | Painel admin com versionamento e processo de curadoria |

---

## 16. Glossário

| Termo | Significado |
|---|---|
| LLM | Large Language Model — o "cérebro" que gera as respostas |
| RAG | Retrieval-Augmented Generation — busca trechos relevantes da base e injeta no contexto do modelo |
| Embedding | Representação numérica de um texto que permite busca por significado (semântica) |
| Banco vetorial | Banco otimizado para armazenar embeddings e fazer busca por similaridade |
| Prompt do sistema | Instruções fixas que definem personalidade, tom e regras do agente |
| Guardrails | Regras e filtros que impedem o agente de sair do escopo ou gerar risco |
| SCI | Situação–Comportamento–Impacto: metodologia de feedback |
| CNV | Comunicação Não Violenta: metodologia de comunicação empática em 4 passos |
| LGPD | Lei Geral de Proteção de Dados (Brasil) |
| 1:1 | Reunião individual entre líder e liderado |

---

## 17. Próximos passos

1. Validar este SDD com os stakeholders da consultoria
2. Finalizar a curadoria e chunking da base de conhecimento existente
3. Escrever a versão definitiva do prompt do sistema + conjunto de casos de teste
4. Selecionar provedores (LLM, embeddings, auth, nuvem) e fechar orçamento por conversa
5. Iniciar a Fase 0 (Fundação) e planejar piloto do MVP com grupo de líderes reais

---

*Documento vivo. Revisado a cada fase. v1.0 — 09/06/2026*
