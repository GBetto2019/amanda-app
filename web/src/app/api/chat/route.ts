import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { acessoAtivo, hojeLocal } from "@/lib/acesso";
import { getSystemPrompt } from "@/lib/config";

const client = new Anthropic();

// Limites de proteção de custo/abuso.
const LIMITE_DIARIO = 40; // mensagens por aluno por dia
const MAX_MENSAGEM = 4000; // caracteres por mensagem
const MAX_HISTORICO = 40; // mensagens no histórico enviado

async function validateAccess(): Promise<{
  ok: boolean;
  status: number;
  userId?: string;
}> {
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
    ? { ok: true, status: 200, userId: user.id }
    : { ok: false, status: 403 };
}

// Teto diário. Fail-open: se a tabela não existir/der erro, não bloqueia o chat.
async function dentroDoLimiteDiario(userId: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const dia = hojeLocal();
    const { data } = await admin
      .from("chat_usage")
      .select("contador")
      .eq("user_id", userId)
      .eq("dia", dia)
      .maybeSingle();
    const usado = data?.contador ?? 0;
    if (usado >= LIMITE_DIARIO) return false;
    await admin
      .from("chat_usage")
      .upsert(
        { user_id: userId, dia, contador: usado + 1 },
        { onConflict: "user_id,dia" }
      );
    return true;
  } catch {
    return true;
  }
}

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

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_HISTORICO ||
    messages.some((m) => typeof m.content !== "string" || m.content.length > MAX_MENSAGEM)
  ) {
    return new Response("Mensagem inválida ou muito longa.", { status: 400 });
  }

  if (access.userId && !(await dentroDoLimiteDiario(access.userId))) {
    return new Response(
      "Você atingiu o limite de mensagens de hoje. Volte amanhã que o mentor te espera. 🙂",
      { status: 429 }
    );
  }

  const anthropicMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const systemPrompt = await getSystemPrompt();

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: systemPrompt,
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
