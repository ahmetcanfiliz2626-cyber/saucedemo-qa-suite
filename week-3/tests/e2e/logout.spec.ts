import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'

test.describe('Logout', () => {
  test('standard_user — login → ürün ekle → hamburger menü → logout → login sayfasına dön', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await page.goto('https://www.saucedemo.com/')
    await loginPage.login('standard_user', 'secret_sauce')
    await inventoryPage.addToCart('Sauce Labs Backpack')
    await inventoryPage.logout()

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.usernameInput).toBeVisible()
  })
})
