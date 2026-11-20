import { Locator, Page } from '@playwright/test';
import { TestUser } from '../utils/dataFactory';

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
    await this.registerLink.first().click();
    await this.registerTitle.waitFor({ state: 'visible' });
  }

  /** Llena y envía el formulario de registro. */
  async register(user: TestUser): Promise<void> {
    await this.cedulaInput.fill(user.cedula);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.privacyPolicyCheckbox.check({ force: true });
    await this.registerButton.click();
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
    await this.loginCedulaInput.fill(cedula);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
