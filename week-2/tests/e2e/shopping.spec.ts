import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('ürüne tıklayınca detay sayfası açılır', async ({ page }) => {
  await page.locator('.inventory_item_name').first().click();

  await expect(page).toHaveURL(/\/inventory-item\.html/);
  await expect(page.locator('.inventory_details_name')).toBeVisible();
});

test('"Add to cart" tıklayınca buton "Remove" olur', async ({ page }) => {
  const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  await addBtn.click();

  await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
});

test('sepet ikonu üzerindeki sayı güncellenir', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
});

test('ürünleri fiyata göre low-to-high sıralar', async ({ page }) => {
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  const prices = page.locator('.inventory_item_price');
  const values = await prices.allTextContents();
  const numbers = values.map((v) => parseFloat(v.replace('$', '')));

  for (let i = 0; i < numbers.length - 1; i++) {
    expect(numbers[i]).toBeLessThanOrEqual(numbers[i + 1]);
  }
});

test('sepete eklenen ürünler cart sayfasında görünür', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page).toHaveURL(/\/cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});

test('"Remove" ile ürün sepetten silinir', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

test('"Continue Shopping" inventory sayfasına döner', async ({ page }) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="continue-shopping"]').click();

  await expect(page).toHaveURL(/\/inventory\.html/);
});

test('ad, soyad, zip kodu girip devam → overview sayfası açılır', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  await expect(page.locator('.summary_info')).toBeVisible();
});

test('overview sayfasında toplam fiyat doğru hesaplanmıştır', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  // Backpack $29.99 + Bike Light $9.99 = $39.98
  const itemTotal = page.locator('.summary_subtotal_label');
  await expect(itemTotal).toContainText('$39.98');
});

test('"Finish" tıklayınca "Thank you" mesajı görünür', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();

  await expect(page).toHaveURL(/\/checkout-complete\.html/);
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});
