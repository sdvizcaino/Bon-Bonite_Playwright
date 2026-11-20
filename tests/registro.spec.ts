import { test, expect } from '../fixtures/evidence';
import { AccountPage } from '../pages/AccountPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { createUser } from '../utils/dataFactory';
import { highlight, takeEvidence } from '../utils/evidence';

test.describe('ESC-01 · Registro de usuario', () => {
  test('un visitante se registra con datos válidos y entra a Mi cuenta @registro', async ({ page }, testInfo) => {
    const user = createUser();
    const accountPage = new AccountPage(page);
    const myAccountPage = new MyAccountPage(page);

    await test.step('Abrir el formulario de registro', async () => {
      await accountPage.goto();
      await accountPage.openRegisterForm();
      await expect(accountPage.registerTitle).toBeVisible();
      await takeEvidence(page, testInfo, 'formulario_registro');
    });

    await test.step('Registrar un usuario nuevo con datos Faker', async () => {
      await accountPage.fillRegisterForm(user);
      await takeEvidence(page, testInfo, 'formulario_registro_lleno', true);
      await accountPage.submitRegisterForm();
    });

    await test.step('Verificar que entra a Mi cuenta con su nombre', async () => {
      await expect(page).toHaveURL(/\/mi-cuenta\/orders\/?/);
      await expect(myAccountPage.greeting).toContainText(user.firstName);
      await expect(myAccountPage.ordersTab).toBeVisible();
      await expect(myAccountPage.detailsTab).toBeVisible();
      await expect(myAccountPage.creditsTab).toBeVisible();
      await expect(myAccountPage.pqrsTab).toBeVisible();
      await highlight(myAccountPage.greeting);
      await highlight(myAccountPage.accountNav);
      await takeEvidence(page, testInfo, 'mi_cuenta_registro_OK');
    });
  });
});
