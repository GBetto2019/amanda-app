import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANOS_COM_MENTOR, type Plano } from "@/lib/hotmart/checkout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: {
    nome?: string;
    email?: string;
    telefone?: string;
    plano?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const nome = (body.nome ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const telefone = (body.telefone ?? "").trim();
  const plano = (body.plano ?? "").trim() as Plano;

  if (!nome || nome.length > 120) {
    return NextResponse.json({ erro: "Informe um nome válido." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }
  if (telefone.length > 40) {
    return NextResponse.json({ erro: "Telefone inválido." }, { status: 400 });
  }
  if (!PLANOS_COM_MENTOR.includes(plano)) {
    return NextResponse.json({ erro: "Plano inválido." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: existente } = await supabase
    .from("assinantes")
    .select("id, acesso_status")
    .eq("email", email)
    .maybeSingle();

  if (existente) {
    // Só atualiza um lead ainda pendente. Se já estiver ativo/inativo, não deixa
    // um novo cadastro (possível abuso com e-mail de terceiro) sobrescrever os
    // dados — apenas segue para o checkout (ex.: renovação).
    if (existente.acesso_status === "pendente") {
      await supabase
        .from("assinantes")
        .update({
          nome,
          telefone: telefone || null,
          plano_escolhido: plano,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existente.id);
    }
  } else {
    const { error } = await supabase.from("assinantes").insert({
      nome,
      email,
      telefone: telefone || null,
      plano_escolhido: plano,
      pagamento_status: "aguardando",
      acesso_status: "pendente",
    });
    if (error) {
      return NextResponse.json(
        { erro: "Não foi possível concluir o cadastro. Tente novamente." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
