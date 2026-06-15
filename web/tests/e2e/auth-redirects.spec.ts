import { test, expect } from "@playwright/test";

test.describe("Redirecionamentos de Auth (usuário não autenticado)", () => {
  test("/chat redireciona para /entrar", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL(/\/entrar/);
  });

  test("/planos redireciona para /entrar", async ({ page }) => {
    await page.goto("/planos");
    await expect(page).toHaveURL(/\/entrar/);
  });

  test("/aguardando redireciona para /entrar", async ({ page }) => {
    await page.goto("/aguardando");
    await expect(page).toHaveURL(/\/entrar/);
  });

  test("/cadastro redireciona para /entrar", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(page).toHaveURL(/\/entrar/);
  });
});
