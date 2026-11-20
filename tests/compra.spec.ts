import { test, expect } from '../fixtures/evidence';
import { AccountPage } from '../pages/AccountPage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { createBillingData, createUser } from '../utils/dataFactory';
import { highlight, takeEvidence } from '../utils/evidence';

test.describe('ESC-03 · Compra de producto', () => {
  test('un usuario registrado lleva un bolso hasta el paso de pago sin confirmar @compra', async ({ page }, testInfo) => {
    const user = createUser();
    const billing = createBillingData();
    const accountPage = new AccountPage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);
    let productName = '';

    await test.step('Precondición: registrar un usuario nuevo con Faker', async () => {
      await accountPage.registerNewUser(user);
    });

    await test.step('Abrir el primer producto disponible de Bolsos', async () => {
      await categoryPage.goto('bolsos-mujer');
      await categoryPage.openFirstProduct();
      productName = await productPage.getName();
      expect(productName).not.toBe('');
      await highlight(productPage.title);
      await takeEvidence(page, testInfo, 'producto_bolsos');
    });

    await test.step('Añadir el producto al carrito', async () => {
      await productPage.addToCart();
      await expect(productPage.addedToCartMessage).toContainText(/se ha añadido a tu carrito/i);
      await expect(productPage.addedToCartMessage).toContainText(productName, { ignoreCase: true });
      await highlight(productPage.addedToCartMessage);
      await takeEvidence(page, testInfo, 'producto_en_carrito');
    });

    await test.step('Ir a Finalizar compra y revisar el resumen', async () => {
      await checkoutPage.goto();
      await expect(checkoutPage.productInSummary(productName)).toBeVisible();
      await expect(checkoutPage.total).toBeVisible();
      await highlight(checkoutPage.productInSummary(productName));
      await highlight(checkoutPage.total);
      await takeEvidence(page, testInfo, 'resumen_carrito');
      await checkoutPage.continueToNextStep();
    });

    await test.step('Llenar la facturación con datos Faker de Colombia', async () => {
      await checkoutPage.fillBilling(billing);
      await expect(checkoutPage.termsCheckbox).toBeChecked();
      await takeEvidence(page, testInfo, 'facturacion_llena', true);
    });

    await test.step('Llegar al paso de pago SIN confirmar la orden', async () => {
      await expect(checkoutPage.productInSummary(productName)).toBeVisible();
      await expect(checkoutPage.paymentMethod).toBeVisible();
      await expect(checkoutPage.placeOrderButton).toBeVisible();
      await expect(checkoutPage.placeOrderButton).toBeEnabled();
      await highlight(checkoutPage.paymentMethod);
      await highlight(checkoutPage.placeOrderButton);
      await takeEvidence(page, testInfo, 'pago_sin_confirmar_OK', true);
      // Fin del escenario: NO se hace clic en "REGISTRAR ORDEN" para no crear un pedido real.
    });
  });
});
