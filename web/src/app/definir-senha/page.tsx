"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";
import { createClient } from "@/lib/supabase/client";

type Estado = "verificando" | "pronto" | "invalido" | "salvo";

export default function DefinirSenhaPage() {
  const [estado, setEstado] = useState<Estado>("verificando");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let resolvido = false;

    // O link de recovery entrega a sessão pela URL (hash ou ?code=). O
    // onAuthStateChange dispara quando o Supabase termina de processá-la.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        resolvido = true;
        setEstado("pronto");
      }
    });

    (async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code).catch(() => {});
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        resolvido = true;
        setEstado("pronto");
      } else {
        // Dá tempo do processamento da URL concluir antes de invalidar.
        setTimeout(() => {
          if (!resolvido) setEstado("invalido");
        }, 2000);
      }
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 8) {
      setErro("A senha precisa ter ao menos 8 caracteres.");
      return;
    }
    if (senha !== confirma) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setErro("Não foi possível salvar a senha. Tente novamente pelo link do e-mail.");
      setLoading(false);
      return;
    }
    setEstado("salvo");
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
        <div className="w-full max-w-[400px]">
          <SunIcon size={36} className="text-sol mb-6" />

          {estado === "verificando" && (
            <p className="text-[15px] text-cafe-2">Verificando seu link…</p>
          )}

          {estado === "invalido" && (
            <>
              <h1 className="font-serif italic text-[clamp(30px,7vw,44px)] leading-[1] text-cafe mb-3">
                Link expirado.
              </h1>
              <p className="text-[14px] text-cafe-2 leading-relaxed">
                Este link para definir a senha não é mais válido. Fale com o
                suporte para receber um novo.{" "}
                <a
                  href="https://wa.me/5511974668867"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sol hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </>
          )}

          {estado === "pronto" && (
            <>
              <h1 className="font-serif italic text-[clamp(30px,7vw,44px)] leading-[1] text-cafe mb-3">
                Defina sua<br />
                <span className="text-sol">senha.</span>
              </h1>
              <p className="text-[14px] text-cafe-2 leading-relaxed mb-8">
                Crie uma senha para acessar o Mentor IA.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-cafe-3 mb-2">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-white border border-[var(--linha)] rounded-xl px-4 py-3 text-[14px] text-cafe outline-none focus:border-sol transition-colors"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-cafe-3 mb-2">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    required
                    value={confirma}
                    onChange={(e) => setConfirma(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-white border border-[var(--linha)] rounded-xl px-4 py-3 text-[14px] text-cafe outline-none focus:border-sol transition-colors"
                  />
                </div>
                {erro && <p className="text-[13px] text-brasa leading-snug">{erro}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-xl hover:bg-sol-soft active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? "Salvando…" : "Salvar senha"}
                </button>
              </form>
            </>
          )}

          {estado === "salvo" && (
            <>
              <h1 className="font-serif italic text-[clamp(30px,7vw,44px)] leading-[1] text-cafe mb-3">
                Senha criada!
              </h1>
              <p className="text-[14px] text-cafe-2 leading-relaxed mb-6">
                Tudo pronto, Líder. Já pode acessar o mentor.
              </p>
              <Link
                href="/chat"
                className="block text-center bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-xl hover:bg-sol-soft transition-colors"
              >
                Ir para o Mentor IA →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
