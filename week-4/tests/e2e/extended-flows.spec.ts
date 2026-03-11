import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../week-3/tests/e2e/pages/LoginPage';
import { InventoryPage } from '../../../week-3/tests/e2e/pages/InventoryPage';
import { CartPage } from '../../../week-3/tests/e2e/pages/CartPage';
import { CheckoutPage } from '../../../week-3/tests/e2e/pages/CheckoutPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USERNAME, PASSWORD);
  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('tam satın alma flow\'u: login → ürün ekle → cart → checkout → finish → thank you', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await expect(cart.cartItems).toHaveCount(1);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('John', 'Doe', '12345');
  await expect(page).toHaveURL(/\/checkout-step-two\.html/);

  await checkout.finish();
  await expect(page).toHaveURL(/\/checkout-complete\.html/);

  const header = await checkout.getConfirmationHeader();
  expect(header).toBe('Thank you for your order!');
});

test('birden fazla ürün sepete ekle, toplam fiyat doğru mu', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.addToCart('sauce-labs-bike-light');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await expect(cart.cartItems).toHaveCount(2);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('John', 'Doe', '12345');

  const totalText = await checkout.getTotal();
  // Backpack $29.99 + Bike Light $9.99 = $39.98
  expect(totalText).toContain('39.98');
});

test('sepete ekle, sonra çıkar, badge sıfırlanıyor mu', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await expect(inventory.cartBadge).toHaveText('1');

  await inventory.removeFromCart('sauce-labs-backpack');
  await expect(inventory.cartBadge).not.toBeVisible();
});

test('ürün detay sayfasından sepete ekle, cart\'a git, ürün orada mı', async ({ page }) => {
  await page.locator('.inventory_item_name').first().click();
  await expect(page).toHaveURL(/\/inventory-item\.html/);

  await page.locator('[data-test^="add-to-cart"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  const cart = new CartPage(page);
  await expect(cart.cartItems).toHaveCount(1);
});

test('checkout\'ta firstName boş bırak, hata mesajı çıkıyor mu', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('', 'Doe', '12345');

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('First Name is required');
});
