import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyHottok } from "@/lib/hotmart/verify";

describe("verifyHottok", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("retorna true quando token bate com a env var", () => {
    process.env.HOTMART_HOTTOK = "token-secreto-123";
    expect(verifyHottok("token-secreto-123")).toBe(true);
  });

  it("retorna false quando token não bate", () => {
    process.env.HOTMART_HOTTOK = "token-secreto-123";
    expect(verifyHottok("token-errado")).toBe(false);
  });

  it("retorna false quando token é null", () => {
    process.env.HOTMART_HOTTOK = "token-secreto-123";
    expect(verifyHottok(null)).toBe(false);
  });

  it("retorna false quando env var não está definida", () => {
    delete process.env.HOTMART_HOTTOK;
    expect(verifyHottok("qualquer-coisa")).toBe(false);
  });

  it("retorna false quando ambos são undefined/null", () => {
    delete process.env.HOTMART_HOTTOK;
    expect(verifyHottok(null)).toBe(false);
  });

  it("é case-sensitive — tokens iguais em casing diferente não batem", () => {
    process.env.HOTMART_HOTTOK = "Token123";
    expect(verifyHottok("token123")).toBe(false);
  });
});
