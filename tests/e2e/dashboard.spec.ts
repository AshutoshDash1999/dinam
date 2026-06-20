import { test, expect } from "@playwright/test"

test("dashboard renders correctly", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator("body")).toBeVisible()
})
