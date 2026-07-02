"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function siteOrigin(): Promise<string> {
  // Preferir o domínio canônico (evita mandar o link do convite para uma URL de
  // preview que não esteja na allowlist do Supabase Auth).
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function orNull(v: string): string | null {
  return v === "" ? null : v;
}

// Procura o id de um usuário de auth pelo e-mail (paginação simples).
async function findUserIdByEmail(
  sb: SupabaseClient,
  email: string
): Promise<string | null> {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data || data.users.length === 0) return null;
    const found = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
    );
    if (found) return found.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

// Libera o Mentor IA: cria/convida a conta, envia o e-mail de "definir senha"
// e ativa o acesso com os dados preenchidos pelo admin.
export async function liberarMentor(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Não autorizado.");

  const id = str(formData.get("id"));
  const plano = orNull(str(formData.get("plano_escolhido")));
  const valor = orNull(str(formData.get("valor")));
  const dataInicio = orNull(str(formData.get("data_inicio")));
  const dataFim = orNull(str(formData.get("data_fim")));
  if (!id) throw new Error("Assinante inválido.");

  // Regra de negócio: o plano Básico não dá acesso ao Mentor IA.
  if (plano === "basico") {
    throw new Error("O plano Básico não inclui o Mentor IA.");
  }

  const sb = createAdminClient();
  const { data: a } = await sb
    .from("assinantes")
    .select("id, email, user_id")
    .eq("id", id)
    .single();
  if (!a) throw new Error("Assinante não encontrado.");

  // Cria a conta SEM enviar e-mail (o acesso é entregue pelo "link de acesso"
  // gerado no painel). O aluno define a senha ao abrir o link.
  let userId: string | null = a.user_id;
  if (!userId) {
    const { data: created, error } = await sb.auth.admin.createUser({
      email: a.email,
      email_confirm: true,
    });
    if (error) {
      // Provável "usuário já existe": localiza o id existente.
      userId = await findUserIdByEmail(sb, a.email);
      if (!userId) throw new Error("Falha ao criar a conta: " + error.message);
    } else {
      userId = created.user.id;
    }
  }

  await sb
    .from("assinantes")
    .update({
      acesso_status: "ativo",
      plano_escolhido: plano,
      valor,
      data_inicio: dataInicio,
      data_fim: dataFim,
      user_id: userId,
      liberado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin");
}

// Salva alterações manuais (plano, valor, datas, status) sem recriar a conta.
export async function atualizarAssinante(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Não autorizado.");

  const id = str(formData.get("id"));
  if (!id) throw new Error("Assinante inválido.");

  const sb = createAdminClient();
  await sb
    .from("assinantes")
    .update({
      plano_escolhido: orNull(str(formData.get("plano_escolhido"))),
      valor: orNull(str(formData.get("valor"))),
      data_inicio: orNull(str(formData.get("data_inicio"))),
      data_fim: orNull(str(formData.get("data_fim"))),
      acesso_status: str(formData.get("acesso_status")) || "pendente",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin");
}

// Inativa o acesso ao Mentor IA.
export async function inativarAssinante(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Não autorizado.");

  const id = str(formData.get("id"));
  if (!id) throw new Error("Assinante inválido.");

  const sb = createAdminClient();
  await sb
    .from("assinantes")
    .update({ acesso_status: "inativo", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
}

// Gera um link de acesso ("definir senha") para o admin copiar e enviar ao aluno
// (ex.: WhatsApp). Não envia e-mail. Cria a conta caso ainda não exista.
export async function gerarLinkAcesso(
  id: string
): Promise<{ link?: string; erro?: string }> {
  const admin = await getAdminUser();
  if (!admin) return { erro: "Não autorizado." };

  const sb = createAdminClient();
  const { data: a } = await sb
    .from("assinantes")
    .select("email, user_id")
    .eq("id", id)
    .single();
  if (!a) return { erro: "Assinante não encontrado." };

  if (!a.user_id) {
    const { data: created, error } = await sb.auth.admin.createUser({
      email: a.email,
      email_confirm: true,
    });
    const uid = created?.user?.id ?? (await findUserIdByEmail(sb, a.email));
    if (error && !uid) return { erro: "Falha ao criar a conta." };
    if (uid) {
      await sb
        .from("assinantes")
        .update({ user_id: uid, updated_at: new Date().toISOString() })
        .eq("id", id);
    }
  }

  const origin = await siteOrigin();
  const { data: linkData, error } = await sb.auth.admin.generateLink({
    type: "recovery",
    email: a.email,
    options: { redirectTo: `${origin}/definir-senha` },
  });
  if (error || !linkData) {
    return { erro: "Não foi possível gerar o link." };
  }
  return { link: linkData.properties.action_link };
}

// Salva o prompt do Mentor IA definido pelo admin.
export async function salvarPrompt(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Não autorizado.");

  const prompt = str(formData.get("prompt"));
  const sb = createAdminClient();
  await sb.from("app_config").upsert(
    { key: "system_prompt", value: prompt, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  revalidatePath("/admin");
}

// Restaura o prompt padrão (remove a personalização). Recebe FormData por ser
// usada como formAction, mas ignora o conteúdo.
export async function restaurarPrompt(_formData: FormData) {
  void _formData;
  const admin = await getAdminUser();
  if (!admin) throw new Error("Não autorizado.");

  const sb = createAdminClient();
  await sb.from("app_config").delete().eq("key", "system_prompt");
  revalidatePath("/admin");
}

export async function sairAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
