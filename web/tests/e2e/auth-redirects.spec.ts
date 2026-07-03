import { test, expect } from "@playwright/test";

test.describe("Controle de acesso (usuário não autenticado)", () => {
  test("/chat redireciona para /login", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/aguardando redireciona para /login", async ({ page }) => {
    await page.goto("/aguardando");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/admin redireciona para /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("/planos é pública (não redireciona)", async ({ page }) => {
    await page.goto("/planos");
    await expect(page).toHaveURL(/\/planos/);
  });

  test("/cadastro com plano é pública (não redireciona)", async ({ page }) => {
    await page.goto("/cadastro?plano=premium");
    await expect(page).toHaveURL(/\/cadastro/);
  });

  test("/cadastro sem plano volta para /planos", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(page).toHaveURL(/\/planos/);
  });
});
