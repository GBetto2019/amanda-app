"use client";

import { useState } from "react";
import { checkoutUrl, type Plano } from "@/lib/hotmart/checkout";

export function CadastroForm({ plano }: { plano: Plano }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, plano }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.erro ?? "Não foi possível concluir. Tente novamente.");
        setLoading(false);
        return;
      }

      // Cadastro salvo → segue para o checkout da Hotmart.
      window.location.href = checkoutUrl(plano);
    } catch {
      setErro("Falha de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-cafe-3 mb-2">
          Nome completo
        </label>
        <input
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoComplete="name"
          className="w-full bg-white border border-[var(--linha)] rounded-xl px-4 py-3 text-[14px] text-cafe outline-none focus:border-sol transition-colors"
          placeholder="Seu nome"
        />
      </div>

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
          WhatsApp <span className="text-cafe-3/60">(opcional)</span>
        </label>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          autoComplete="tel"
          className="w-full bg-white border border-[var(--linha)] rounded-xl px-4 py-3 text-[14px] text-cafe outline-none focus:border-sol transition-colors"
          placeholder="(11) 90000-0000"
        />
      </div>

      {erro && <p className="text-[13px] text-brasa leading-snug">{erro}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.18em] py-3.5 rounded-xl hover:bg-sol-soft active:scale-[0.99] transition-all disabled:opacity-50"
      >
        {loading ? "Salvando…" : "Ir para o pagamento →"}
      </button>
    </form>
  );
}
