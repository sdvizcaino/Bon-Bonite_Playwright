import { Locator, Page } from '@playwright/test';
import { highlight } from '../utils/evidence';

/** Detalle de un producto. */
export class ProductPage {
  readonly page: Page;
  readonly title: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1').first();
    this.addToCartButton = page.locator('button[name="add-to-cart"]');
    this.addedToCartMessage = page.locator('.woocommerce-message');
  }

  async getName(): Promise<string> {
    return (await this.title.innerText()).trim();
  }

  async addToCart(): Promise<void> {
    await highlight(this.addToCartButton);
    await this.addToCartButton.click();
  }
}
