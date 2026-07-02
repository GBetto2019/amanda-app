"use client";

import { useState } from "react";
import { SunIcon } from "@/components/ui/SunIcon";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    if (error || !data.user) {
      setErro("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    // Confere se o usuário é admin antes de entrar no painel.
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      setErro("Este acesso não tem permissão de administrador.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="min-h-[100dvh] bg-cafe flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2.5 mb-8">
          <SunIcon size={26} className="text-sol" />
          <span className="font-serif italic text-lg text-creme leading-none">
            acordei, virei líder.
          </span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amanhecer mb-3">
          Painel administrativo
        </p>
        <h1 className="font-serif italic text-[clamp(30px,7vw,44px)] leading-[1] text-creme mb-8">
          Acesso restrito.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-creme/50 mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-creme/5 border border-creme/15 rounded-xl px-4 py-3 text-[14px] text-creme outline-none focus:border-sol transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-creme/50 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-creme/5 border border-creme/15 rounded-xl px-4 py-3 text-[14px] text-creme outline-none focus:border-sol transition-colors"
            />
          </div>

          {erro && <p className="text-[13px] text-amanhecer leading-snug">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-xl hover:bg-sol-soft active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar no painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
