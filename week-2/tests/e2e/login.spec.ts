import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// --- Başarılı giriş ---

test('standard_user ile giriş → /inventory.html sayfasına yönlenir', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('giriş sonrası "Swag Labs" logosu görünür', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
});

test('giriş sonrası 6 ürün listelenir', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

// --- Başarısız giriş ---

test('locked_out_user ile giriş → hata mesajı görünür', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Sorry, this user has been locked out.'
  );
});

test('yanlış şifre ile giriş → hata mesajı görünür', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username and password do not match any user in this service'
  );
});

// --- Validasyon ---

test('boş username → "Username is required" mesajı', async ({ page }) => {
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
});

test('boş password → "Password is required" mesajı', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
});

// --- Hata kapatma ---

test('hata mesajındaki X butonuna tıklayınca mesaj kapanır', async ({ page }) => {
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  await page.locator('[data-test="error"] button').click();

  await expect(page.locator('[data-test="error"]')).not.toBeVisible();
});
