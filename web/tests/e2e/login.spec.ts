import { test, expect } from "@playwright/test";

test.describe("Página /login (acesso ao Mentor IA)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("carrega sem erros", async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test("exibe a saudação 'Bom dia.'", async ({ page }) => {
    await expect(page.getByText("Bom dia.")).toBeVisible();
  });

  test("exibe campos de e-mail e senha", async ({ page }) => {
    await expect(page.getByPlaceholder("voce@email.com")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("exibe 'Esqueci minha senha'", async ({ page }) => {
    await expect(page.getByText("Esqueci minha senha")).toBeVisible();
  });

  test("exibe link 'Ver planos'", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Ver planos" })).toBeVisible();
  });

  test("link do logo volta para a landing", async ({ page }) => {
    await page.getByText("acordei, virei líder.").first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
