import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * BUG KEŞİF TESTLERİ — performance_glitch_user
 * Login ve sayfa yüklenme süreleri ölçülür.
 * SauceDemo bu kullanıcı için yapay gecikme ekler.
 */

test('login süresi 5 saniyeden az olmalı', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const start = Date.now();
  await loginPage.login('performance_glitch_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html/);
  const elapsed = Date.now() - start;

  // BUG: performance_glitch_user için login 3-5 sn sürer, ancak 5sn altında kalmalı
  console.log(`Login süresi: ${elapsed}ms`);
  expect(elapsed).toBeLessThan(5000);
});

test('inventory sayfası 3 saniyeden az yüklenmeli', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('performance_glitch_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html/);

  const start = Date.now();
  await page.waitForSelector('.inventory_item', { state: 'visible' });
  const elapsed = Date.now() - start;

  // BUG: ürün listesi 3 saniyeden uzun sürebilir
  console.log(`Inventory yüklenme süresi: ${elapsed}ms`);
  expect(elapsed).toBeLessThan(3000);
});
