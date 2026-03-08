import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test('standard_user ile giriş → /inventory.html sayfasına yönlenir', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('giriş sonrası "Swag Labs" logosu görünür', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
});

test('giriş sonrası 6 ürün listelenir', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('locked_out_user ile giriş → hata mesajı görünür', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('locked_out_user', 'secret_sauce');

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Sorry, this user has been locked out.');
});

test('yanlış şifre ile giriş → hata mesajı görünür', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'wrong_password');

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Username and password do not match any user in this service');
});

test('boş username → "Username is required" mesajı', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginButton.click();

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Username is required');
});

test('boş password → "Password is required" mesajı', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.usernameInput.fill('standard_user');
  await loginPage.loginButton.click();

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Password is required');
});

test('hata mesajındaki X butonuna tıklayınca mesaj kapanır', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginButton.click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await page.locator('[data-test="error"] button').click();
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();
});
