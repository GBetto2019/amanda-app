import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { acessoAtivo } from "@/lib/acesso";
import { getSystemPrompt } from "@/lib/config";

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
