import { Locator, Page } from '@playwright/test';
import { highlight } from '../utils/evidence';

/** Mi cuenta con sesión iniciada (/mi-cuenta/orders/): saludo y pestañas. */
export class MyAccountPage {
  readonly page: Page;
  readonly greeting: Locator;
  readonly accountNav: Locator;
  readonly ordersTab: Locator;
  readonly detailsTab: Locator;
  readonly creditsTab: Locator;
  readonly pqrsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greeting = page.getByRole('heading', { name: /Hola,/ });
    // Menú de pestañas de la cuenta (se ve en mayúsculas por CSS, pero el texto real es "Pedidos", "Datos"...).
    this.accountNav = page.getByRole('navigation', { name: 'Páginas de cuenta' });
    this.ordersTab = this.accountNav.getByRole('link', { name: 'Pedidos', exact: true });
    this.detailsTab = this.accountNav.getByRole('link', { name: 'Datos', exact: true });
    this.creditsTab = this.accountNav.getByRole('link', { name: 'Créditos', exact: true });
    this.pqrsTab = this.accountNav.getByRole('link', { name: 'PQRS', exact: true });
  }

  async goToDetails(): Promise<void> {
    await highlight(this.detailsTab);
    await this.detailsTab.click();
    await this.page.waitForURL('**/mi-cuenta/edit-account/');
  }
}
