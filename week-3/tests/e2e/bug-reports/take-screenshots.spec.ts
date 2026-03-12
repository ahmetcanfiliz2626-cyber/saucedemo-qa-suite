import { test } from '@playwright/test'
import * as fs from 'fs'

test.beforeAll(() => {
  if (!fs.existsSync('week-3/tests/e2e/bug-reports/screenshots')) {
    fs.mkdirSync('week-3/tests/e2e/bug-reports/screenshots', { recursive: true })
  }
})

test('BUG-001 screenshot — problem_user ürün görselleri yanlış', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/')
  await page.fill('[data-test="username"]', 'problem_user')
  await page.fill('[data-test="password"]', 'secret_sauce')
  await page.click('[data-test="login-button"]')
  await page.screenshot({ path: 'week-3/tests/e2e/bug-reports/screenshots/BUG-001-wrong-images.png' })
})

test('BUG-002 screenshot — problem_user Add to cart çalışmıyor', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/')
  await page.fill('[data-test="username"]', 'problem_user')
  await page.fill('[data-test="password"]', 'secret_sauce')
  await page.click('[data-test="login-button"]')
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]')
  await page.screenshot({ path: 'week-3/tests/e2e/bug-reports/screenshots/BUG-002-add-to-cart-fail.png' })
})

test('BUG-005 screenshot — problem_user checkout Last Name siliniyor', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/')
  await page.fill('[data-test="username"]', 'problem_user')
  await page.fill('[data-test="password"]', 'secret_sauce')
  await page.click('[data-test="login-button"]')
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]')
  await page.click('.shopping_cart_link')
  await page.click('[data-test="checkout"]')
  await page.fill('[data-test="firstName"]', 'John')
  await page.fill('[data-test="lastName"]', 'Doe')
  await page.fill('[data-test="postalCode"]', '12345')
  await page.screenshot({ path: 'week-3/tests/e2e/bug-reports/screenshots/BUG-005-lastname-cleared.png' })
})
