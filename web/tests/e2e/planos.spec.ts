import { test, expect } from "@playwright/test";

// /planos agora é pública (fluxo: Começar -> Planos -> Cadastro -> Hotmart).
test.describe("Página /planos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/planos");
  });

  test("carrega sem redirecionar", async ({ page }) => {
    await expect(page).toHaveURL(/\/planos/);
    await expect(page.getByText("Escolha seu plano")).toBeVisible();
  });

  test("exibe os três planos", async ({ page }) => {
    await expect(page.getByText("Aprenda")).toBeVisible();
    await expect(page.getByText("Mentor IA")).toBeVisible();
    await expect(page.getByText("Evolua com acompanhamento")).toBeVisible();
  });

  test("plano com Mentor IA leva ao /cadastro", async ({ page }) => {
    await expect(
      page.locator('a[href="/cadastro?plano=complementar"]')
    ).toBeVisible();
    await expect(
      page.locator('a[href="/cadastro?plano=premium"]')
    ).toBeVisible();
  });

  test("plano Básico leva ao checkout da Hotmart", async ({ page }) => {
    await expect(page.locator('a[href*="pay.hotmart.com"]')).toBeVisible();
  });
});
