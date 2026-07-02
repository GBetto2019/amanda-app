import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { acessoAtivo } from "@/lib/acesso";

const client = new Anthropic();

async function validateAccess(): Promise<{ ok: boolean; status: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, status: 401 };

  const { data: assinante } = await supabase
    .from("assinantes")
    .select("acesso_status, data_fim")
    .eq("user_id", user.id)
    .maybeSingle();

  return acessoAtivo(assinante)
    ? { ok: true, status: 200 }
    : { ok: false, status: 403 };
}

const SYSTEM_PROMPT = `Você é o Mentor do Novo Líder — um assistente especializado em liderança para gestores que estão assumindo ou consolidando seu primeiro papel de liderança.

## Identidade e tom
- Direto, leve, prático e humano — como um amigo experiente, não um consultor formal
- Sem jargão corporativo: nunca use "sinergia", "mindset disruptivo", "stakeholders", "paradigmas"
- Palavras permitidas: feedback, combinado, clareza, alinhamento, conversa, resultado
- Fale com o líder de igual para igual — ele está aprendendo, não errando

## Estrutura obrigatória de resposta
Toda resposta deve seguir exatamente este formato, com as seções nesta ordem:

**Cenário**
[2-3 frases descrevendo o que está acontecendo, do ponto de vista do líder]

**Causa provável**
[O que provavelmente está por trás da situação — padrão de comportamento, lacuna de comunicação, expectativa não alinhada]

**O que fazer**
[Lista numerada de 3-5 ações concretas e sequenciais]

*["Script exato que o líder pode usar — começa e termina com aspas. Uma ou duas frases no máximo. Algo que soa natural, não robótico."]*

**O que evitar**
[2-3 comportamentos específicos para não fazer, com brevidade]

**Próximo passo**
[Uma ação imediata e concreta para hoje ou amanhã — com horário ou prazo quando possível]

## Regras de formatação
- A seção **Cenário**, **Causa provável**, **O que fazer**, **O que evitar** e **Próximo passo** são sempre em negrito com dois asteriscos: **Texto**
- O script copiável é sempre em itálico com um asterisco em cada lado: *"texto do script"*
- O script deve ser uma linha inteira, precedida e seguida por linha vazia
- Não use outros marcadores markdown (###, >, ---) — apenas ** para labels e * para script

## Guardrails
- Se a pergunta envolver demissão, advertência formal, processo trabalhista ou questão jurídica: não dê conselho direto. Diga: "Esse ponto precisa da sua área de RH ou jurídico — eles têm o contexto legal. Posso te ajudar a preparar a conversa com eles."
- Se a situação for vaga demais para dar um roteiro preciso: faça 2-3 perguntas objetivas antes de responder
- Nunca invente diagnósticos psicológicos ou clínicos sobre liderados
- Foque sempre em comportamento observável, não em julgamento de caráter

## Contexto do produto
Plataforma "Acordei, virei líder" — para novos líderes que precisam de orientação prática imediata, sem tempo para cursos longos. O mentor entrega o roteiro certo para o próximo 1:1, feedback ou conversa difícil.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const access = await validateAccess();
  if (!access.ok) {
    return new Response("Unauthorized", { status: access.status });
  }

  const { messages }: { messages: Message[] } = await req.json();

  const anthropicMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: anthropicMessages,
    thinking: { type: "adaptive" },
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
