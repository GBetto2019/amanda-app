"use client";

import { useState } from "react";
import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha incorretos. Confira e tente novamente.");
      setLoading(false);
      return;
    }

    // O proxy decide o destino conforme o status do acesso.
    window.location.href = "/chat";
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

          <h1 className="font-serif italic text-[clamp(36px,8vw,56px)] leading-[1] text-cafe mb-3">
            Bom dia.<br />
            <span className="text-sol">Líder.</span>
          </h1>

          <p className="text-[14px] md:text-[15px] text-cafe-2 leading-relaxed mb-8">
            Acesse o mentor com o e-mail e a senha que você recebeu após a
            liberação do seu plano.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-cafe-3 mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-white border border-[var(--linha)] rounded-xl px-4 py-3 text-[14px] text-cafe outline-none focus:border-sol transition-colors"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-cafe-3 mb-2">
                Senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-white border border-[var(--linha)] rounded-xl px-4 py-3 text-[14px] text-cafe outline-none focus:border-sol transition-colors"
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <p className="text-[13px] text-brasa leading-snug">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-xl hover:bg-sol-soft active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="text-center text-[12px] text-cafe-3 mt-6 leading-relaxed">
            Ainda não tem acesso?{" "}
            <Link href="/planos" className="text-sol hover:underline">
              Ver planos
            </Link>
            <br />
            Problemas para entrar?{" "}
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
