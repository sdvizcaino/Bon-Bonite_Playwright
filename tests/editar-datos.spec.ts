import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { createPhone, createUser } from '../utils/dataFactory';
import { faker } from '@faker-js/faker';

test.describe('ESC-02 · Modificar datos del usuario', () => {
  test('un usuario registrado actualiza nombre, apellido y teléfono @datos', async ({ page }) => {
    const user = createUser();
    const newData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: createPhone(),
    };
    const accountPage = new AccountPage(page);
    const myAccountPage = new MyAccountPage(page);
    const detailsPage = new AccountDetailsPage(page);

    await test.step('Precondición: registrar un usuario nuevo con Faker', async () => {
      await accountPage.registerNewUser(user);
    });

    await test.step('Ir a la pestaña Datos', async () => {
      await myAccountPage.goToDetails();
      await expect(detailsPage.personalDataCard).toContainText(user.firstName);
      await page.screenshot({ path: 'evidencias/ESC-02_datos_antes.png' });
    });

    await test.step('Actualizar nombre, apellido y teléfono y guardar', async () => {
      await detailsPage.updatePersonalData(newData);
    });

    await test.step('Verificar que se muestran los nuevos datos', async () => {
      await expect(detailsPage.successMessage).toBeVisible();
      await expect(detailsPage.personalDataCard).toContainText(newData.firstName);
      await expect(detailsPage.personalDataCard).toContainText(newData.lastName);
      await expect(detailsPage.personalDataCard).toContainText(newData.phone);
    });

    await test.step('Verificar que los cambios persisten al recargar', async () => {
      await page.reload();
      await expect(detailsPage.personalDataCard).toContainText(newData.firstName);
      await expect(detailsPage.personalDataCard).toContainText(newData.lastName);
      await expect(detailsPage.personalDataCard).toContainText(newData.phone);
      await page.screenshot({ path: 'evidencias/ESC-02_datos_actualizados_OK.png' });
    });
  });
});
