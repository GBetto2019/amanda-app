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

  if (!nome) {
    return NextResponse.json({ erro: "Informe seu nome." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }
  if (!PLANOS_COM_MENTOR.includes(plano)) {
    return NextResponse.json({ erro: "Plano inválido." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // E-mail é único: se já houver lead, atualiza (sem sobrescrever um acesso já
  // ativo). Caso contrário, cria um novo lead pendente.
  const { data: existente } = await supabase
    .from("assinantes")
    .select("id, acesso_status")
    .eq("email", email)
    .maybeSingle();

  if (existente) {
    await supabase
      .from("assinantes")
      .update({
        nome,
        telefone: telefone || null,
        plano_escolhido: plano,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existente.id);
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
