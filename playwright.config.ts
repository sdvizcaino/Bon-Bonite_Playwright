import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/**
 * Configuración de Playwright para bon-bonite.com (sitio de producción).
 * - 1 worker: los tests corren uno a la vez para no saturar el sitio real.
 * - Video y screenshot siempre activos: son la evidencia de cada escenario.
 * - Trace solo cuando un test falla (diagnóstico sin inflar artefactos).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.bon-bonite.com',
    locale: 'es-CO',
    video: 'on',
    screenshot: 'on',
    trace: 'retain-on-failure',
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
