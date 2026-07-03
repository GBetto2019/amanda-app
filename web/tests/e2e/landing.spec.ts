import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("carrega com o título correto", async ({ page }) => {
    await expect(page).toHaveTitle(/Acordei, virei líder/);
  });

  test("exibe o headline do hero", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Acordei/ })).toBeVisible();
  });

  test("exibe o subtítulo do hero", async ({ page }) => {
    await expect(
      page.getByText("Seu mentor de bolso que te ajuda")
    ).toBeVisible();
  });

  test("CTA principal aponta para /planos", async ({ page }) => {
    const cta = page.getByRole("link", { name: /Fale com o mentor/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/planos");
  });

  test("exibe a seção Manifesto", async ({ page }) => {
    await expect(page.getByText("01 — Manifesto")).toBeVisible();
  });

  test("exibe a seção Personalidade com cards", async ({ page }) => {
    await expect(page.getByText("02 — Personalidade")).toBeVisible();
    await expect(page.getByText("Direto.")).toBeVisible();
    await expect(page.getByText("Prático.")).toBeVisible();
    await expect(page.getByText("Humano.")).toBeVisible();
  });

  test("exibe a seção Como funciona", async ({ page }) => {
    await expect(page.getByText("03 — Como funciona")).toBeVisible();
    await expect(page.getByText("Três passos.")).toBeVisible();
  });

  test("exibe a seção Programa com 180 dias", async ({ page }) => {
    await expect(page.getByText("180 dias")).toBeVisible();
    await expect(page.getByText("05 — Programa")).toBeVisible();
  });

  test("CTAs 'Começar' apontam para /planos", async ({ page }) => {
    const cta = page.locator('a[href="/planos"]').first();
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
  });

  test("rodapé exibe suporte pelo WhatsApp", async ({ page }) => {
    const suporte = page.getByRole("link", { name: /WhatsApp/i });
    await suporte.scrollIntoViewIfNeeded();
    await expect(suporte).toBeVisible();
  });

  test("header está visível com logo", async ({ page }) => {
    await expect(page.getByText("acordei, virei líder.").first()).toBeVisible();
  });

  test("não há links apontando para /chat na landing", async ({ page }) => {
    const chatLinks = page.locator('a[href="/chat"]');
    await expect(chatLinks).toHaveCount(0);
  });
});
