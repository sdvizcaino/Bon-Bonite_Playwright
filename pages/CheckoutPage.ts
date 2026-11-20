import { expect, Locator, Page } from '@playwright/test';
import { BillingData } from '../utils/dataFactory';

/** Finalizar compra (/finalizar-compra/): Carrito → Ingreso → Facturación → Pago. */
export class CheckoutPage {
  readonly page: Page;

  // Paso Carrito
  readonly total: Locator;
  readonly continueButton: Locator;

  // Paso Facturación (con sesión iniciada, el paso "Ingreso" se salta)
  readonly phoneInput: Locator;
  readonly countrySelect: Locator;
  readonly stateSelect: Locator;
  readonly citySelect: Locator;
  readonly addressInput: Locator;
  readonly postcodeInput: Locator;
  readonly termsCheckbox: Locator;

  // Pago (misma página que Facturación). El test NUNCA hace clic en "REGISTRAR ORDEN" (no se crean pedidos reales).
  readonly paymentMethod: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.total = page.getByRole('heading', { name: 'Total', exact: true }).locator('visible=true').first();
    this.continueButton = page.getByRole('button', { name: 'Continuar' });

    this.phoneInput = page.locator('#billing_phone');
    this.countrySelect = page.locator('#billing_country');
    // Al elegir Colombia, Departamento pasa a ser un <select> con buscador (select2).
    this.stateSelect = page.locator('#billing_state');
    // Ciudad también es un <select>; sus opciones se cargan según el departamento.
    this.citySelect = page.locator('#billing_city');
    this.addressInput = page.locator('#billing_address_1');
    this.postcodeInput = page.locator('#billing_postcode');
    this.termsCheckbox = page.locator('#terms');

    this.paymentMethod = page.getByText('Paga a través de Wompi.');
    this.placeOrderButton = page.locator('#place_order');
  }

  async goto(): Promise<void> {
    await this.page.goto('/finalizar-compra/');
  }

  /** Producto dentro del resumen del paso Carrito. */
  productInSummary(productName: string): Locator {
    // El nombre también existe en el mini-carrito oculto; solo interesa el visible.
    return this.page.getByText(productName).locator('visible=true').first();
  }

  async continueToNextStep(): Promise<void> {
    await this.continueButton.locator('visible=true').first().click();
  }

  /** Espera a que desaparezca el overlay de carga del checkout de WooCommerce. */
  async waitForCheckoutUpdate(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('.blockUI')).toHaveCount(0);
  }

  /** Llena los campos de facturación que no vienen precargados del registro. */
  async fillBilling(data: BillingData): Promise<void> {
    await this.phoneInput.fill(data.phone);
    await this.countrySelect.selectOption('CO');
    // select2 oculta el <select> original; se elige la opción directamente sobre él.
    await this.stateSelect.selectOption({ label: data.state }, { force: true });
    await this.citySelect.selectOption({ label: data.city }, { force: true });
    await this.addressInput.fill(data.address);
    await this.postcodeInput.fill(data.postcode);
    // Al cambiar la dirección, WooCommerce recarga el resumen del pedido por AJAX
    // (muestra un overlay .blockUI) y vuelve a dibujar el checkbox. Se espera a que termine.
    await this.waitForCheckoutUpdate();
    // El botón flotante de WhatsApp queda encima del checkbox y "roba" el clic,
    // por eso se envía el evento click directamente al checkbox.
    await this.termsCheckbox.dispatchEvent('click');
  }
}
