import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content ?? "";

  // Stub que retorna resposta na estrutura padrão do mentor
  const response = buildStubResponse(lastMessage);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const char of response) {
        controller.enqueue(encoder.encode(char));
        await new Promise((r) => setTimeout(r, 8));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function buildStubResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("feedback") || lower.includes("reclama")) {
    return `**Cenário**
Liderado que entrega bem mas reclama com frequência.

**Causa provável**
Pode ser um padrão de comportamento ou uma resposta ao ambiente. Antes de agir, vale checar se há algo específico acontecendo.

**O que fazer**
1. Escolhe um momento calmo — não no calor do episódio
2. Reconhece a entrega antes de tocar no comportamento
3. Apresenta o padrão que você observou (não o julgamento)
4. Pergunta antes de afirmar — abre espaço pra ele falar

*"Quero conversar sobre um ponto delicado com respeito e clareza. Tenho percebido que, quando trazemos uma nova demanda, costuma vir uma reclamação. Você percebe isso também? Como podemos ajustar juntos?"*

**O que evitar**
Não rotule a pessoa ("você é negativo") e não dê o feedback no calor da emoção.

**Próximo passo**
Marca a conversa pra amanhã, 9h. Título: "alinhar combinado". Depois me conta como foi.`;
  }

  if (lower.includes("1:1") || lower.includes("terapia") || lower.includes("desabafo")) {
    return `**Cenário**
Reunião 1:1 que virou sessão de desabafo.

**Causa provável**
Provavelmente falta de estrutura no início da reunião — sem pauta clara, o espaço vira catarse.

**O que fazer**
1. Abre sempre com a pauta: "Hoje quero cobrir X e Y — você tem algo pra adicionar?"
2. Quando ele começar a reclamar fora do escopo: "Entendo, isso é importante. Posso anotar pra a gente tratar numa próxima vez?"
3. Redireciona para o combinado da semana anterior

*"Quero que esse espaço seja útil pra você e pra mim. O que foi mais importante essa semana? O que ficou em aberto?"*

**O que evitar**
Não corta bruto — redireciona. Não deixa a reunião sem próximo passo claro.

**Próximo passo**
Na próxima 1:1, começa com: "Tenho 3 pontos pra hoje. Você tem mais algum?" — isso seta o tom.`;
  }

  return `**Cenário**
Situação recebida: "${input.slice(0, 80)}${input.length > 80 ? "..." : ""}"

**Antes de continuar**
Pra te dar o roteiro certo, me conta mais:

1. Há quanto tempo você lidera essa pessoa?
2. Isso aconteceu uma vez ou é um padrão?
3. Como é a relação de vocês no geral?

Com isso consigo montar o script exato pra você usar.`;
}
