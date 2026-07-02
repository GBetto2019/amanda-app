import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { acessoAtivo } from "@/lib/acesso";
import { AssinanteForm, type Assinante } from "./AssinanteForm";
import { sairAdmin } from "./actions";

export default async function AdminPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("assinantes")
    .select(
      "id, nome, email, telefone, plano_escolhido, valor, pagamento_status, acesso_status, data_inicio, data_fim, user_id, created_at"
    )
    .order("created_at", { ascending: false });

  const assinantes = (data ?? []) as Assinante[];
  const totalCadastros = assinantes.length;
  const ativos = assinantes.filter((a) => acessoAtivo(a)).length;
  const aguardando = assinantes.filter(
    (a) => a.acesso_status === "pendente"
  ).length;

  return (
    <div className="min-h-[100dvh] bg-creme">
      <header className="px-5 md:px-12 h-14 flex items-center justify-between border-b border-[var(--linha-soft)] bg-creme/90 sticky top-0 z-10 backdrop-blur-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brasa">
          Painel · acordei, virei líder
        </p>
        <form action={sairAdmin}>
          <button className="font-mono text-[10px] uppercase tracking-[0.16em] text-cafe-2 hover:text-sol transition-colors">
            Sair
          </button>
        </form>
      </header>

      <main className="px-5 md:px-12 py-10 md:py-14">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="font-serif italic text-[clamp(30px,5vw,52px)] leading-[1] text-cafe mb-8">
            Assinantes
          </h1>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Metric label="Cadastros" valor={totalCadastros} />
            <Metric label="Com Mentor IA (ativos)" valor={ativos} destaque />
            <Metric label="Aguardando liberação" valor={aguardando} />
          </div>

          {/* Lista */}
          {assinantes.length === 0 ? (
            <p className="text-[14px] text-cafe-2">
              Nenhum cadastro ainda. Os leads aparecem aqui assim que alguém se
              cadastra em um plano com Mentor IA.
            </p>
          ) : (
            <div className="space-y-4">
              {assinantes.map((a) => (
                <AssinanteForm key={a.id} a={a} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Metric({
  label,
  valor,
  destaque = false,
}: {
  label: string;
  valor: number;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 ${
        destaque ? "bg-cafe text-creme" : "border border-[var(--linha)] bg-white"
      }`}
    >
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-3 ${
          destaque ? "text-amanhecer" : "text-cafe-3"
        }`}
      >
        {label}
      </p>
      <p
        className={`font-serif italic text-[clamp(36px,5vw,52px)] leading-none ${
          destaque ? "text-creme" : "text-cafe"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}
