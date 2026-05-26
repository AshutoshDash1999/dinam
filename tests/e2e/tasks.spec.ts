import { test, expect } from '@playwright/test';

test('user can create a task', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('task-input').fill('Playwright Task');

  await page.getByTestId('add-task-btn').click();

  await expect(page.getByText('Playwright Task')).toBeVisible();
});