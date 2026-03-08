import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipCode: Locator;

  constructor(private page: Page) {
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.zipCode = page.locator('[data-test="postalCode"]');
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.zipCode.fill(zip);
    await this.page.locator('[data-test="continue"]').click();
  }

  async getTotal(): Promise<string> {
    return this.page.locator('.summary_subtotal_label').innerText();
  }

  async finish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async getConfirmationHeader(): Promise<string> {
    return this.page.locator('[data-test="complete-header"]').innerText();
  }
}
