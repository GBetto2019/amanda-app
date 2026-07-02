import { redirect } from "next/navigation";
import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";
import { PLANOS_COM_MENTOR, type Plano } from "@/lib/hotmart/checkout";
import { CadastroForm } from "./CadastroForm";

const LABELS: Record<Plano, string> = {
  basico: "Aprenda",
  complementar: "Mentor IA",
  premium: "Evolua com acompanhamento",
};

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;
  const planoValido = (plano ?? "") as Plano;

  // Cadastro só existe para os planos com Mentor IA. Básico vai direto ao Hotmart.
  if (!PLANOS_COM_MENTOR.includes(planoValido)) {
    redirect("/planos");
  }

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
        <div className="w-full max-w-[440px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brasa mb-3">
            Plano {LABELS[planoValido]}
          </p>
          <h1 className="font-serif italic text-[clamp(32px,7vw,52px)] leading-[1] text-cafe mb-3">
            Falta pouco,<br />
            <span className="text-sol">Líder.</span>
          </h1>
          <p className="text-[14px] md:text-[15px] text-cafe-2 leading-relaxed mb-8">
            Deixe seus dados para vincularmos seu acesso ao Mentor IA. Em
            seguida você finaliza o pagamento na Hotmart.
          </p>

          <CadastroForm plano={planoValido} />

          <p className="text-center text-[12px] text-cafe-3 mt-6 leading-relaxed">
            Use o mesmo e-mail no checkout da Hotmart.
            <br />
            Dúvidas?{" "}
            <a
              href="https://wa.me/5511974668867"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sol hover:underline"
            >
              Fale pelo WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
