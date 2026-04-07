import { test, expect } from "@playwright/test";

test("홈페이지가 로드된다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Todo Calendar" })).toBeVisible();
});
