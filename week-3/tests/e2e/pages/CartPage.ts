import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(private page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItem(name: string) {
    const slug = name.toLowerCase().replace(/[\s().]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async continueShopping() {
    await this.page.locator('[data-test="continue-shopping"]').click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
