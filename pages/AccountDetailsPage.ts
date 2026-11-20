import { Locator, Page } from '@playwright/test';
import { highlight } from '../utils/evidence';

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

  /** Activa la edición y cambia nombre, apellido y teléfono (sin guardar). */
  async editPersonalData(data: PersonalData): Promise<void> {
    await highlight(this.updateInfoButton);
    await this.updateInfoButton.click();
    await highlight(this.firstNameInput);
    await this.firstNameInput.fill(data.firstName);
    await highlight(this.lastNameInput);
    await this.lastNameInput.fill(data.lastName);
    await highlight(this.phoneInput);
    await this.phoneInput.fill(data.phone);
  }

  async save(): Promise<void> {
    await highlight(this.saveButton);
    await this.saveButton.click();
  }
}
