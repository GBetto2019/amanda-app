"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SunIcon } from "@/components/ui/SunIcon";
import { createClient } from "@/lib/supabase/client";

const WHATSAPP = "https://wa.me/5511974668867";

export default function AguardandoPage() {
  const router = useRouter();

  // Polling: redireciona automaticamente ao receber status 'active' via webhook
  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("status, acesso_expira_em")
        .eq("id", user.id)
        .single();

      const isActive =
        profile?.status === "active" &&
        (!profile.acesso_expira_em ||
          new Date(profile.acesso_expira_em) > new Date());

      if (isActive) {
        router.push("/chat");
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [router]);

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
          {/* Animated sun */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-16 h-16 rounded-full bg-sol/10 animate-ping" />
            <SunIcon size={48} className="text-sol relative" />
          </div>

          <h1 className="font-serif italic text-[clamp(36px,7vw,60px)] leading-[1.05] text-cafe mb-4">
            Processando<br />
            <span className="text-sol">pagamento.</span>
          </h1>
          <p className="text-[15px] md:text-[17px] text-cafe-2 leading-relaxed mb-8 max-w-md mx-auto">
            Assim que o pagamento for confirmado, você é redirecionado
            automaticamente — sem precisar fazer nada.
          </p>

          {/* Steps */}
          <div className="text-left space-y-3 mb-10 bg-linho rounded-[1.5rem] p-6 md:p-7">
            {[
              { num: "01", text: "Pagamento aprovado na Hotmart" },
              { num: "02", text: "Acesso liberado automaticamente" },
              { num: "03", text: "Você é redirecionado para o mentor" },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.16em] text-cafe-3 shrink-0 w-6">
                  {step.num}
                </span>
                <p className="text-[14px] text-cafe-2 leading-snug">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/planos"
              className="inline-flex items-center justify-center bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3.5 rounded-full hover:bg-sol-soft transition-colors"
            >
              Ver planos
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cafe/20 text-cafe font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3.5 rounded-full hover:bg-cafe/5 transition-colors"
            >
              Suporte WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
