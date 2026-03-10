import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('login sayfası görsel testi', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await expect(page).toHaveScreenshot('login-page.png');
});

test('standard_user — inventory sayfası görsel testi', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveScreenshot('inventory-page.png');
});

test('problem_user — inventory sayfası görsel testi', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('problem_user', 'secret_sauce');

  await expect(page).toHaveScreenshot('inventory-problem-user.png');
});
