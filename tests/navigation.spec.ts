import { test, expect } from '@playwright/test';

test.describe('Global navigation', () => {
  test('mobile menu toggles, traps focus, and restores state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Toggle main menu' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await page.waitForTimeout(400);

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const dialog = page.getByRole('dialog', { name: 'Main navigation' });
    await expect(dialog).toBeVisible();

    const firstLink = dialog.getByRole('link', { name: 'Home', exact: true });
    await expect(firstLink).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    const closeButton = page.getByRole('button', { name: 'Close menu' });
    await expect(closeButton).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(firstLink).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('desktop navigation stays visible without toggle', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Global' });
    await expect(nav.getByRole('link', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle main menu' })).toBeHidden();
  });
});
