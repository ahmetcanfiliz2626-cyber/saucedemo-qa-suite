import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * BUG KEŞİF TESTLERİ — error_user
 * Bu testlerin bir kısmı kasıtlı olarak FAIL etmeli.
 */

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('error_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html/);
});

// BUG: Last Name alanına yazılan değer otomatik siliniyor
test('BUG — Last Name alanı doldurulabilmeli ve silinmemeli', async ({ page }) => {
  test.fail(true, 'Known bug: Last Name field is automatically cleared for error_user');
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('Doe');
  await checkout.zipCode.fill('12345');

  // Devam etmeden önce Last Name hâlâ dolu olmalı — BUG: alan temizlenir
  await expect(checkout.lastName).toHaveValue('Doe');
});

// BUG: Last Name silindiğinde gösterilen hata mesajı doğru olmalı
test('BUG — Last Name boş kalınca "Last Name is required" hatası görünmeli', async ({ page }) => {
  test.fail(true, 'Known bug: error message for missing Last Name is not shown correctly for error_user');
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.firstName.fill('John');
  // Last Name kasıtlı boş bırakılıyor
  await checkout.zipCode.fill('12345');
  await page.locator('[data-test="continue"]').click();

  // BUG: error_user'da Last Name otomatik silindiğinden bu hata zaten tetiklenir
  await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
});

// BUG: sepetten ürün kaldırma çalışmıyor
test('BUG — sepetten ürün kaldırma çalışmalı', async ({ page }) => {
  test.fail(true, 'Known bug: remove button does not work for error_user');
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.removeItem('sauce-labs-backpack');

  // Sepet boşalmalı — BUG: ürün hâlâ sepette kalır
  expect(await cart.getItemCount()).toBe(0);
});

// BUG: sıralama seçeneği değiştirildiğinde ürünler sıralanmıyor
test('BUG — low-to-high sıralama doğru çalışmalı', async ({ page }) => {
  test.fail(true, 'Known bug: sorting has no effect for error_user');
  const inventory = new InventoryPage(page);
  await inventory.sortBy('lohi');

  const prices = page.locator('.inventory_item_price');
  const values = await prices.allTextContents();
  const numbers = values.map((v: string) => parseFloat(v.replace('$', '')));

  // BUG: sıralama uygulanmaz, liste değişmez
  for (let i = 0; i < numbers.length - 1; i++) {
    expect(numbers[i]).toBeLessThanOrEqual(numbers[i + 1]);
  }
});
