import { test, expect } from '@playwright/test';

test('theme persists after reload', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('theme-toggle').click();

  await page.reload();

  await expect(page.locator('html')).toHaveClass(/dark/);
});