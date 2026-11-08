import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
});

test('discovery offer waits ten seconds and stays dismissed on return visits', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero').getByRole('button', { name: 'Buy', exact: true })).toBeEnabled();
  const popup = page.getByRole('dialog', { name: 'Your free Discovery Kit' });
  await page.clock.runFor(9999);
  await expect(popup).not.toBeVisible();
  await page.clock.runFor(1);
  await expect(popup).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popup).not.toBeVisible();
  await page.reload();
  await page.clock.runFor(11000);
  await expect(popup).not.toBeVisible();
});

test('mobile discovery signup validates email and confirms the demo without storing personal data', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.hero').getByRole('button', { name: 'Buy', exact: true })).toBeEnabled();
  await page.clock.runFor(10000);
  const popup = page.getByRole('dialog', { name: 'Your free Discovery Kit' });
  await expect(popup).toBeVisible();
  await popup.getByRole('button', { name: 'Get my free discovery kit', exact: true }).click();
  await expect(popup.getByRole('status')).toHaveCount(0);
  await popup.getByLabel('Email address', { exact: true }).fill('not-an-email');
  await popup.getByRole('button', { name: 'Get my free discovery kit', exact: true }).click();
  await expect(popup.getByRole('status')).toHaveCount(0);
  await popup.getByLabel('Email address', { exact: true }).fill('reader@example.com');
  await popup.getByRole('button', { name: 'Get my free discovery kit', exact: true }).click();
  await expect(popup.getByRole('status')).toContainText('No email has been sent or kit reserved.');
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain('reader@example.com');
  const bounds = await popup.boundingBox();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
  await popup.getByRole('button', { name: 'Continue exploring' }).click();
  await expect(popup).not.toBeVisible();
});

test('discovery timer is cancelled when leaving the homepage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('link', { name: 'Products', exact: true }).click();
  await expect(page).toHaveURL('/products');
  await page.clock.runFor(15000);
  await expect(page.getByRole('dialog', { name: 'Your free Discovery Kit' })).not.toBeVisible();
});

test('discovery offer waits for privacy dialog and supports keyboard focus and backdrop dismissal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Privacy notice', exact: true }).click();
  await page.clock.runFor(10000);
  const popup = page.getByRole('dialog', { name: 'Your free Discovery Kit' });
  await expect(popup).not.toBeVisible();
  await page.keyboard.press('Escape');
  await page.clock.runFor(500);
  await expect(popup).toBeVisible();
  await expect(popup.getByRole('button', { name: 'Close discovery offer' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(popup.getByLabel('Email address', { exact: true })).toBeFocused();
  await page.mouse.click(2, 2);
  await expect(popup).not.toBeVisible();
});

test('discovery offer remains usable when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
  });
  await page.goto('/');
  await expect(page.locator('.hero').getByRole('button', { name: 'Buy', exact: true })).toBeEnabled();
  await page.clock.runFor(10000);
  const popup = page.getByRole('dialog', { name: 'Your free Discovery Kit' });
  await expect(popup).toBeVisible();
  await popup.getByRole('button', { name: 'Close discovery offer' }).click();
  await expect(popup).not.toBeVisible();
});
