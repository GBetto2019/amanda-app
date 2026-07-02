"use client";

import Link from "next/link";
import { SunIcon } from "@/components/ui/SunIcon";

const navLinks = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#programa", label: "Programa" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-creme/90 backdrop-blur-sm border-b border-[var(--linha-soft)]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 font-serif italic text-xl text-cafe leading-none"
        >
          <SunIcon size={28} className="text-sol" />
          <span>acordei,<br className="hidden" /> virei líder.</span>
        </Link>

        <nav className="hidden md:flex gap-8 font-mono text-[11px] uppercase tracking-[0.16em] text-cafe-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-sol transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-cafe-2 hover:text-sol transition-colors px-3 py-2"
          >
            Acessar o Mentor
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 bg-sol text-creme font-mono text-[11px] uppercase tracking-[0.16em] px-5 py-2.5 rounded-full hover:bg-sol-soft transition-colors"
          >
            Começar →
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/login"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-cafe-2 hover:text-sol transition-colors px-2 py-2"
          >
            Entrar
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center bg-sol text-creme font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 rounded-full"
          >
            Começar
          </Link>
        </div>
      </div>
    </header>
  );
}
