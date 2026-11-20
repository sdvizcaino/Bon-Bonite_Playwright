import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { createUser } from '../utils/dataFactory';

test.describe('ESC-01 · Registro de usuario', () => {
  test('un visitante se registra con datos válidos y entra a Mi cuenta @registro', async ({ page }) => {
    const user = createUser();
    const accountPage = new AccountPage(page);
    const myAccountPage = new MyAccountPage(page);

    await test.step('Abrir el formulario de registro', async () => {
      await accountPage.goto();
      await accountPage.openRegisterForm();
      await expect(accountPage.registerTitle).toBeVisible();
    });

    await test.step('Registrar un usuario nuevo con datos Faker', async () => {
      await accountPage.register(user);
    });

    await test.step('Verificar que entra a Mi cuenta con su nombre', async () => {
      await expect(page).toHaveURL(/\/mi-cuenta\/orders\/?/);
      await expect(myAccountPage.greeting).toContainText(user.firstName);
      await expect(myAccountPage.ordersTab).toBeVisible();
      await expect(myAccountPage.detailsTab).toBeVisible();
      await expect(myAccountPage.creditsTab).toBeVisible();
      await expect(myAccountPage.pqrsTab).toBeVisible();
      await page.screenshot({ path: 'evidencias/ESC-01_registro_OK.png', fullPage: false });
    });
  });
});
