import { test, expect } from '../fixtures/evidence';
import { AccountPage } from '../pages/AccountPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { createPhone, createUser } from '../utils/dataFactory';
import { faker } from '@faker-js/faker';
import { highlight, takeEvidence } from '../utils/evidence';

test.describe('ESC-02 · Modificar datos del usuario', () => {
  test('un usuario registrado actualiza nombre, apellido y teléfono @datos', async ({ page }, testInfo) => {
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
      await highlight(detailsPage.personalDataCard);
      await takeEvidence(page, testInfo, 'datos_antes');
    });

    await test.step('Actualizar nombre, apellido y teléfono y guardar', async () => {
      await detailsPage.editPersonalData(newData);
      await takeEvidence(page, testInfo, 'datos_editados_antes_de_guardar');
      await detailsPage.save();
    });

    await test.step('Verificar que se muestran los nuevos datos', async () => {
      await expect(detailsPage.successMessage).toBeVisible();
      await highlight(detailsPage.successMessage);
      await takeEvidence(page, testInfo, 'datos_guardados');
      await expect(detailsPage.personalDataCard).toContainText(newData.firstName);
      await expect(detailsPage.personalDataCard).toContainText(newData.lastName);
      await expect(detailsPage.personalDataCard).toContainText(newData.phone);
    });

    await test.step('Verificar que los cambios persisten al recargar', async () => {
      await page.reload();
      await expect(detailsPage.personalDataCard).toContainText(newData.firstName);
      await expect(detailsPage.personalDataCard).toContainText(newData.lastName);
      await expect(detailsPage.personalDataCard).toContainText(newData.phone);
      await highlight(detailsPage.personalDataCard);
      await takeEvidence(page, testInfo, 'datos_actualizados_tras_recargar_OK');
    });
  });
});
