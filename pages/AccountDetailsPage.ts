import { Locator, Page } from '@playwright/test';

export interface PersonalData {
  firstName: string;
  lastName: string;
  phone: string;
}

/** Pestaña "Datos" de Mi cuenta (/mi-cuenta/edit-account/). */
export class AccountDetailsPage {
  readonly page: Page;
  readonly updateInfoButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;
  readonly personalDataCard: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.updateInfoButton = page.getByRole('button', { name: /actualizar información/i });
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.phoneInput = page.locator('input[name="billing_phone"]');
    this.saveButton = page.getByRole('button', { name: 'GUARDAR' });
    // Tarjeta "Datos Personales": el contenedor más interno que tiene el título y los valores.
    this.personalDataCard = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: 'Datos Personales' }) })
      .filter({ hasText: 'Nombres' })
      .last();
    this.successMessage = page.getByText('Datos personales actualizados correctamente');
  }

  async goto(): Promise<void> {
    await this.page.goto('/mi-cuenta/edit-account/');
  }

  /** Activa la edición, cambia nombre, apellido y teléfono, y guarda. */
  async updatePersonalData(data: PersonalData): Promise<void> {
    await this.updateInfoButton.click();
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.phoneInput.fill(data.phone);
    await this.saveButton.click();
  }
}
