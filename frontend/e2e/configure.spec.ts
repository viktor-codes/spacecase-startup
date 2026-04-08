import { expect, test } from "@playwright/test";

test.describe("configure upload page", () => {
  test("loads heading and NASA sync control", async ({ page }) => {
    await page.goto("/configure/upload");
    await expect(page.getByTestId("configure-page-heading")).toBeVisible();
    await expect(page.getByTestId("configure-sync-nasa")).toBeVisible();
  });

  test.describe("desktop layout", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("shows vertical progress rail and stacked cards, no carousel", async ({
      page,
    }) => {
      await page.goto("/configure/upload");
      await expect(page.getByTestId("configure-progress-desktop")).toBeVisible({
        timeout: 15_000,
      });
      await expect(
        page.getByTestId("configure-progress-mobile"),
      ).not.toBeVisible();
      await expect(page.getByTestId("configure-carousel")).toHaveCount(0);
    });
  });

  test.describe("mobile layout", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("shows horizontal progress under hero and carousel with nav", async ({
      page,
    }) => {
      await page.goto("/configure/upload");
      await expect(page.getByTestId("configure-progress-mobile")).toBeVisible({
        timeout: 15_000,
      });
      await expect(
        page.getByTestId("configure-progress-desktop"),
      ).not.toBeVisible();
      await expect(page.getByTestId("configure-carousel")).toBeVisible();
      await expect(
        page.getByRole("button", { name: /previous configuration step/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /next configuration step/i }),
      ).toBeVisible();
    });
  });
});
