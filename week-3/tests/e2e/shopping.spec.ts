import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('ürüne tıklayınca detay sayfası açılır', async ({ page }) => {
  await page.locator('.inventory_item_name').first().click();

  await expect(page).toHaveURL(/\/inventory-item\.html/);
  await expect(page.locator('.inventory_details_name')).toBeVisible();
});

test('"Add to cart" tıklayınca buton "Remove" olur', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');

  await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
});

test('sepet ikonu üzerindeki sayı güncellenir', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.addToCart('sauce-labs-bike-light');

  await expect(inventory.cartBadge).toHaveText('2');
});

test('ürünleri fiyata göre low-to-high sıralar', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.sortBy('lohi');

  const prices = page.locator('.inventory_item_price');
  const values = await prices.allTextContents();
  const numbers = values.map((v) => parseFloat(v.replace('$', '')));

  for (let i = 0; i < numbers.length - 1; i++) {
    expect(numbers[i]).toBeLessThanOrEqual(numbers[i + 1]);
  }
});

test('sepete eklenen ürünler cart sayfasında görünür', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  expect(await cart.getItemCount()).toBe(1);
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});

test('"Remove" ile ürün sepetten silinir', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.removeItem('sauce-labs-backpack');

  expect(await cart.getItemCount()).toBe(0);
  await expect(inventory.cartBadge).not.toBeVisible();
});

test('"Continue Shopping" inventory sayfasına döner', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.continueShopping();

  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('ad, soyad, zip kodu girip devam → overview sayfası açılır', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('John', 'Doe', '12345');

  await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  await expect(page.locator('.summary_info')).toBeVisible();
});

test('overview sayfasında toplam fiyat doğru hesaplanmıştır', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.addToCart('sauce-labs-bike-light');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('John', 'Doe', '12345');

  // Backpack $29.99 + Bike Light $9.99 = $39.98
  const total = await checkout.getTotal();
  expect(total).toContain('$39.98');
});

test('"Finish" tıklayınca "Thank you" mesajı görünür', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('John', 'Doe', '12345');
  await checkout.finish();

  await expect(page).toHaveURL(/\/checkout-complete\.html/);
  const header = await checkout.getConfirmationHeader();
  expect(header).toBe('Thank you for your order!');
});
