import { expect, test } from "@playwright/test";

test.describe("critical paths", () => {
  test("landing loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /The sky remembers/i }),
    ).toBeVisible();
  });

  test("configure page loads", async ({ page }) => {
    await page.goto("/configure/upload");
    await expect(
      page.getByRole("heading", { name: /Configure Your SpaceCase/i }),
    ).toBeVisible();
  });

  test("try-now anchor navigates from hero", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Preview My Sky/i }).click();
    await expect(page).toHaveURL(/#try-now/);
    await expect(
      page.getByRole("heading", { name: /See NASA's sky on your date/i }),
    ).toBeVisible();
  });
});
