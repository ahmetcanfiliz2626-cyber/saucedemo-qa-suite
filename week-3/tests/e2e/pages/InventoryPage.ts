import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly productList: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(private page: Page) {
    this.productList = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  private slug(productName: string): string {
    return productName.toLowerCase().replace(/[\s().]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
  }

  async addToCart(productName: string) {
    await this.page.locator(`[data-test="add-to-cart-${this.slug(productName)}"]`).click();
  }

  async removeFromCart(productName: string) {
    await this.page.locator(`[data-test="remove-${this.slug(productName)}"]`).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getProductCount(): Promise<number> {
    return this.productList.count();
  }

  async goToCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }
}
