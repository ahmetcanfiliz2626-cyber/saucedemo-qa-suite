import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * BUG KEŞİF TESTLERİ — problem_user
 * Bu testlerin bir kısmı kasıtlı olarak FAIL etmeli.
 * Her FAIL, SauceDemo'daki gerçek bir bug'ı temsil eder.
 */

async function loginAsProblemUser(page: any) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('problem_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html/);
}

async function loginAsStandardUser(page: any) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/\/inventory\.html/);
}

// BUG: problem_user'da tüm ürün resimleri aynı yanlış görseli gösterir
test('BUG — ürün resimleri standard_user ile aynı olmalı', async ({ browser }) => {
  test.fail(true, 'Known bug: problem_user shows sl-404.jpg for all products');
  const standardCtx = await browser.newContext();
  const problemCtx = await browser.newContext();

  const standardPage = await standardCtx.newPage();
  const problemPage = await problemCtx.newPage();

  await loginAsStandardUser(standardPage);
  await loginAsProblemUser(problemPage);

  const standardSrcs = await standardPage.locator('.inventory_item img').evaluateAll(
    (imgs: HTMLImageElement[]) => imgs.map((img) => img.src)
  );
  const problemSrcs = await problemPage.locator('.inventory_item img').evaluateAll(
    (imgs: HTMLImageElement[]) => imgs.map((img) => img.src)
  );

  await standardCtx.close();
  await problemCtx.close();

  // Görseller farklı olmamalı — BUG: hepsi aynı URL'i gösterir
  expect(problemSrcs).toEqual(standardSrcs);
});

// BUG: bazı ürünlerde "Add to cart" tıklanabilir görünür ama sepete eklemez
test('BUG — "Add to cart" tüm ürünlerde çalışmalı', async ({ page }) => {
  test.fail(true, 'Known bug: some Add to cart buttons are unresponsive for problem_user');
  await loginAsProblemUser(page);
  const inventory = new InventoryPage(page);

  const addButtons = page.locator('[data-test^="add-to-cart"]');
  const count = await addButtons.count();

  for (let i = 0; i < count; i++) {
    await addButtons.nth(i).click();
  }

  // Tüm ürünler eklendiyse badge = 6 olmalı — BUG: bazı butonlar çalışmaz
  await expect(inventory.cartBadge).toHaveText('6');
});

// BUG: sıralama seçildiğinde ürünler gerçekte sıralanmaz
test('BUG — low-to-high sıralama doğru çalışmalı', async ({ page }) => {
  test.fail(true, 'Known bug: sorting has no effect for problem_user');
  await loginAsProblemUser(page);
  const inventory = new InventoryPage(page);

  await inventory.sortBy('lohi');

  const prices = page.locator('.inventory_item_price');
  const values = await prices.allTextContents();
  const numbers = values.map((v: string) => parseFloat(v.replace('$', '')));

  for (let i = 0; i < numbers.length - 1; i++) {
    expect(numbers[i]).toBeLessThanOrEqual(numbers[i + 1]);
  }
});

// BUG: ürün adına tıklayınca farklı bir ürünün detay sayfası açılır
test('BUG — ürün detay sayfası tıklanan ürünle eşleşmeli', async ({ page }) => {
  test.fail(true, 'Known bug: clicking a product opens a different product detail page for problem_user');
  await loginAsProblemUser(page);

  const firstName = await page.locator('.inventory_item_name').first().innerText();
  await page.locator('.inventory_item_name').first().click();

  await expect(page).toHaveURL(/\/inventory-item\.html/);

  const detailName = await page.locator('.inventory_details_name').innerText();

  // Detay sayfasındaki isim tıklanan ürünle aynı olmalı — BUG: farklı ürün açılır
  expect(detailName).toBe(firstName);
});

// BUG: checkout formunda Last Name alanı doldurulmuyor / temizleniyor
test('BUG — checkout formu düzgün submit edilebilmeli', async ({ page }) => {
  test.fail(true, 'Known bug: Last Name field gets cleared on checkout for problem_user');
  await loginAsProblemUser(page);
  const inventory = new InventoryPage(page);
  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const checkout = new CheckoutPage(page);
  await checkout.fillInfo('John', 'Doe', '12345');

  // Hata yoksa overview sayfasına geçmeli — BUG: Last Name silinir ve hata verir
  await expect(page).toHaveURL(/\/checkout-step-two\.html/);
});

// BUG: "Remove" butonu tıklanabilir ama sepetten ürünü silmez
test('BUG — Remove butonu ürünü sepetten gerçekten silmeli', async ({ page }) => {
  test.fail(true, 'Known bug: remove button does not work for problem_user');
  await loginAsProblemUser(page);
  const inventory = new InventoryPage(page);

  await inventory.addToCart('sauce-labs-backpack');
  await inventory.goToCart();

  const cart = new CartPage(page);
  await cart.removeItem('sauce-labs-backpack');

  // Sepet boşalmalı — BUG: ürün hâlâ sepette görünür
  expect(await cart.getItemCount()).toBe(0);
});
