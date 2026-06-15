import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  verifyHottok,
  HotmartWebhookPayload,
} from "@/lib/hotmart/verify";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

// Mapeia product.id da Hotmart para nome do plano.
// Preencher com os IDs reais após criação dos produtos.
function resolvePlano(payload: HotmartWebhookPayload): string {
  if (payload.data.subscription?.subscriber?.code) {
    // TODO: distinguir 'clube' de 'premium' por payload.data.product?.id
    return "clube";
  }
  return "basico";
}

export async function POST(req: NextRequest) {
  // Responde 200 rápido para evitar que a Hotmart desative o webhook
  const hottok = req.nextUrl.searchParams.get("hottok");
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

  // Idempotência: ignora transação já processada
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, hotmart_transaction")
    .eq("email", email)
    .maybeSingle();

  if (existing?.hotmart_transaction === transaction) {
    return new Response("OK", { status: 200 });
  }

  if (event === "PURCHASE_APPROVED" || event === "PURCHASE_COMPLETE") {
    const plano = resolvePlano(payload);
    const acessoExpiraEm =
      plano === "basico" ? addMonths(new Date(), 6).toISOString() : null;

    if (existing) {
      await supabase
        .from("profiles")
        .update({
          status: "active",
          plano,
          acesso_expira_em: acessoExpiraEm,
          hotmart_subscriber_code:
            payload.data.subscription?.subscriber?.code ?? null,
          hotmart_transaction: transaction,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);
    } else {
      // Compra feita antes do login: cria perfil já ativo
      await supabase.from("profiles").insert({
        email,
        nome: payload.data.buyer.name ?? null,
        status: "active",
        plano,
        acesso_expira_em: acessoExpiraEm,
        hotmart_subscriber_code:
          payload.data.subscription?.subscriber?.code ?? null,
        hotmart_transaction: transaction,
      });
    }
  } else if (
    event === "PURCHASE_REFUNDED" ||
    event === "PURCHASE_CHARGEBACK" ||
    event === "SUBSCRIPTION_CANCELLATION"
  ) {
    if (existing) {
      await supabase
        .from("profiles")
        .update({
          status: "inactive",
          hotmart_transaction: transaction,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);
    }
  }
  // PURCHASE_DELAYED: mantém pending, não faz nada

  return new Response("OK", { status: 200 });
}
