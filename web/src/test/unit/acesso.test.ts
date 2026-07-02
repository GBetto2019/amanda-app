import { describe, it, expect } from "vitest";
import { acessoAtivo } from "@/lib/acesso";

const HOJE = "2026-07-02";

describe("acessoAtivo", () => {
  it("ativo sem data_fim é vigente", () => {
    expect(acessoAtivo({ acesso_status: "ativo", data_fim: null }, HOJE)).toBe(true);
  });

  it("ativo com data_fim no futuro é vigente", () => {
    expect(acessoAtivo({ acesso_status: "ativo", data_fim: "2026-12-31" }, HOJE)).toBe(true);
  });

  it("ativo com data_fim = hoje ainda é vigente", () => {
    expect(acessoAtivo({ acesso_status: "ativo", data_fim: HOJE }, HOJE)).toBe(true);
  });

  it("ativo com data_fim no passado está expirado", () => {
    expect(acessoAtivo({ acesso_status: "ativo", data_fim: "2026-07-01" }, HOJE)).toBe(false);
  });

  it("status pendente nunca é ativo", () => {
    expect(acessoAtivo({ acesso_status: "pendente", data_fim: null }, HOJE)).toBe(false);
  });

  it("status inativo nunca é ativo", () => {
    expect(acessoAtivo({ acesso_status: "inativo", data_fim: "2026-12-31" }, HOJE)).toBe(false);
  });

  it("null (sem assinante) não é ativo", () => {
    expect(acessoAtivo(null, HOJE)).toBe(false);
  });
});
