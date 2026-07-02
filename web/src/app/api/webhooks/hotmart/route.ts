import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyHottok, HotmartWebhookPayload } from "@/lib/hotmart/verify";

// No modelo manual, o webhook NÃO ativa acesso. Ele apenas sinaliza ao admin
// que o pagamento foi detectado (pagamento_status) para agilizar a liberação.
export async function POST(req: NextRequest) {
  const hottok =
    req.headers.get("x-hotmart-hottok") ??
    req.nextUrl.searchParams.get("hottok");
  if (!verifyHottok(hottok)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: HotmartWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const email = payload.data.buyer.email.toLowerCase().trim();
  const event = payload.event;
  const transaction = payload.data.purchase.transaction;

  const supabase = createAdminClient();

  // As operações abaixo são idempotentes (reprocessar o mesmo evento não causa
  // dano) e o e-mail é único, então não é preciso tabela de deduplicação.
  const { data: existing } = await supabase
    .from("assinantes")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (event === "PURCHASE_APPROVED" || event === "PURCHASE_COMPLETE") {
    if (existing) {
      await supabase
        .from("assinantes")
        .update({
          pagamento_status: "recebido",
          hotmart_transaction: transaction,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      // Comprou sem passar pelo cadastro: cria um lead para o admin ver.
      // Ignora colisão de e-mail (retry concorrente).
      const { error } = await supabase.from("assinantes").insert({
        email,
        nome: payload.data.buyer.name ?? null,
        pagamento_status: "recebido",
        acesso_status: "pendente",
        hotmart_transaction: transaction,
      });
      if (error && error.code !== "23505") {
        return new Response("Erro ao registrar", { status: 500 });
      }
    }
  } else if (
    event === "PURCHASE_REFUNDED" ||
    event === "PURCHASE_CHARGEBACK" ||
    event === "SUBSCRIPTION_CANCELLATION"
  ) {
    if (existing) {
      await supabase
        .from("assinantes")
        .update({
          pagamento_status: "estornado",
          hotmart_transaction: transaction,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    }
  }
  // PURCHASE_DELAYED: nada a fazer

  return new Response("OK", { status: 200 });
}
