import { redirect } from "next/navigation";
import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";
import { createClient } from "@/lib/supabase/server";
import { checkoutUrl } from "@/lib/hotmart/checkout";
import { acessoAtivo, hojeLocal } from "@/lib/acesso";

const WHATSAPP = "https://wa.me/5511974668867";

export default async function AguardandoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: a } = await supabase
    .from("assinantes")
    .select("acesso_status, data_fim")
    .eq("user_id", user.id)
    .maybeSingle();

  // Se por acaso já estiver ativo e vigente, vai direto ao mentor.
  if (acessoAtivo(a)) redirect("/chat");

  const expirou =
    a?.acesso_status === "ativo" && !!a?.data_fim && a.data_fim < hojeLocal();
  const precisaRenovar = a?.acesso_status === "inativo" || expirou;

  return (
    <div className="min-h-[100dvh] bg-creme flex flex-col">
      <header className="px-5 md:px-12 h-14 flex items-center border-b border-[var(--linha-soft)]">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif italic text-base text-cafe leading-none"
        >
          <SunIcon size={22} className="text-sol" />
          acordei, virei líder.
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[520px] text-center">
          <SunIcon size={48} className="text-sol mx-auto mb-6" />

          {precisaRenovar ? (
            <>
              <h1 className="font-serif italic text-[clamp(34px,7vw,58px)] leading-[1.05] text-cafe mb-4">
                Seu acesso<br />
                <span className="text-sol">expirou.</span>
              </h1>
              <p className="text-[15px] md:text-[17px] text-cafe-2 leading-relaxed mb-8 max-w-md mx-auto">
                Para continuar com o Mentor IA, renove seu plano. Após a
                confirmação, reativamos seu acesso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={checkoutUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3.5 rounded-full hover:bg-sol-soft transition-colors"
                >
                  Renovar na Hotmart →
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-cafe/20 text-cafe font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3.5 rounded-full hover:bg-cafe/5 transition-colors"
                >
                  Suporte WhatsApp
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-serif italic text-[clamp(34px,7vw,58px)] leading-[1.05] text-cafe mb-4">
                Estamos liberando<br />
                <span className="text-sol">seu acesso.</span>
              </h1>
              <p className="text-[15px] md:text-[17px] text-cafe-2 leading-relaxed mb-8 max-w-md mx-auto">
                Assim que confirmarmos seu pagamento, seu Mentor IA é liberado e
                você recebe um e-mail. Costuma levar poucas horas.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-cafe/20 text-cafe font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3.5 rounded-full hover:bg-cafe/5 transition-colors"
              >
                Falar com o suporte
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
