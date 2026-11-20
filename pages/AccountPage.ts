import { Locator, Page } from '@playwright/test';
import { TestUser } from '../utils/dataFactory';
import { highlight } from '../utils/evidence';

/** Página /mi-cuenta sin sesión: formularios de inicio de sesión y de registro. */
export class AccountPage {
  readonly page: Page;

  // Inicio de sesión
  readonly loginCedulaInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;

  // Registro
  readonly registerLink: Locator;
  readonly registerTitle: Locator;
  readonly cedulaInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly privacyPolicyCheckbox: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginCedulaInput = page.locator('#username');
    this.loginPasswordInput = page.locator('#password');
    this.loginButton = page.locator('button[name="login"]');

    // "Regístrate" no es un enlace real: es un texto con clic que muestra el formulario.
    this.registerLink = page.getByText('Regístrate', { exact: true });
    this.registerTitle = page.locator('#form-register').getByText('Crea tu cuenta');
    this.cedulaInput = page.locator('#reg_username');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.emailInput = page.locator('#reg_email');
    this.passwordInput = page.locator('#reg_password');
    this.confirmPasswordInput = page.locator('#reg_password2');
    this.privacyPolicyCheckbox = page.locator('#privacy_policy_reg');
    this.registerButton = page.locator('button[name="register"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/mi-cuenta/');
  }

  /** Abre el formulario "Regístrate · Crea tu cuenta". */
  async openRegisterForm(): Promise<void> {
    await highlight(this.registerLink.first());
    await this.registerLink.first().click();
    await this.registerTitle.waitFor({ state: 'visible' });
  }

  /** Llena el formulario de registro (sin enviarlo). */
  async fillRegisterForm(user: TestUser): Promise<void> {
    await highlight(this.cedulaInput);
    await this.cedulaInput.fill(user.cedula);
    await highlight(this.firstNameInput);
    await this.firstNameInput.fill(user.firstName);
    await highlight(this.lastNameInput);
    await this.lastNameInput.fill(user.lastName);
    await highlight(this.emailInput);
    await this.emailInput.fill(user.email);
    await highlight(this.passwordInput);
    await this.passwordInput.fill(user.password);
    await highlight(this.confirmPasswordInput);
    await this.confirmPasswordInput.fill(user.password);
    await highlight(this.privacyPolicyCheckbox);
    await this.privacyPolicyCheckbox.check({ force: true });
  }

  async submitRegisterForm(): Promise<void> {
    await highlight(this.registerButton);
    await this.registerButton.click();
  }

  /** Llena y envía el formulario de registro. */
  async register(user: TestUser): Promise<void> {
    await this.fillRegisterForm(user);
    await this.submitRegisterForm();
  }

  /**
   * Atajo para los escenarios que necesitan un usuario con sesión iniciada:
   * abre /mi-cuenta, registra al usuario y espera a que cargue Mi cuenta.
   */
  async registerNewUser(user: TestUser): Promise<void> {
    await this.goto();
    await this.openRegisterForm();
    await this.register(user);
    await this.page.waitForURL('**/mi-cuenta/orders/**');
  }

  async login(cedula: string, password: string): Promise<void> {
    await highlight(this.loginCedulaInput);
    await this.loginCedulaInput.fill(cedula);
    await highlight(this.loginPasswordInput);
    await this.loginPasswordInput.fill(password);
    await highlight(this.loginButton);
    await this.loginButton.click();
  }
}
