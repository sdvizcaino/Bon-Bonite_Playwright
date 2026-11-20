import { Locator, Page } from '@playwright/test';
import { highlight } from '../utils/evidence';

/** Listado de productos de una categoría (por ejemplo, Bolsos). */
export class CategoryPage {
  readonly page: Page;
  readonly productLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    // Enlaces a productos, excluyendo el bono de regalo que aparece en el listado.
    this.productLinks = page.locator('a[href*="/producto/"]:not([href*="bono"])');
  }

  /** slug de ejemplo: 'bolsos-mujer' */
  async goto(slug: string): Promise<void> {
    await this.page.goto(`/categoria-producto/${slug}/`);
  }

  async openFirstProduct(): Promise<void> {
    await highlight(this.productLinks.first());
    await this.productLinks.first().click();
    await this.page.waitForURL('**/producto/**');
  }
}
