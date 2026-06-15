import { test, expect } from "@playwright/test";

// /planos requer auth — testa o redirect sem sessão
test.describe("Página /planos (sem autenticação)", () => {
  test("redireciona para /entrar quando não autenticado", async ({ page }) => {
    await page.goto("/planos");
    await expect(page).toHaveURL(/\/entrar/);
  });
});

// Testes de conteúdo da página /planos seriam feitos com sessão mockada
// Aqui validamos a estrutura via snapshot de texto público
test.describe("Conteúdo dos planos (verificação de estrutura)", () => {
  test("landing exibe os 3 planos na seção Programa", async ({ page }) => {
    await page.goto("/#programa");
    await expect(page.getByText("180 dias")).toBeVisible();
    await expect(page.getByText("Feedback SCI")).toBeVisible();
    await expect(page.getByText("1:1 que não é terapia")).toBeVisible();
    await expect(page.getByText("Cobrança sem drama")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Conversa difícil bem feita", exact: true })).toBeVisible();
  });
});
