import { defineConfig, devices } from '@playwright/test';

// E2E contra el mock (REVIEWS_SOURCE=mock) o, con E2E_API_URL, contra el API real.
// Los dos guardan estado entre specs, así que corren en serie con un solo worker.
// Contra el API, arráncalo antes con datos de demo (`pnpm demo` en qa-reviewer-api).
const PORT = 4317;
const API_URL = process.env.E2E_API_URL;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      // Usa el Chrome instalado (o el de Playwright en CI con PW_CHANNEL vacío).
      use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL ?? 'chrome' },
    },
  ],
  webServer: {
    command: `pnpm vite dev --port ${PORT} --strictPort`,
    // Espera a que /login responda (no solo el puerto): así la primera compilación
    // en frío de Vite no se come el timeout del primer test.
    url: `http://localhost:${PORT}/login`,
    timeout: 120_000,
    // Server nuevo en cada corrida: el mock arranca siempre con las mismas semillas.
    reuseExistingServer: false,
    env: API_URL ? { REVIEWS_SOURCE: 'api', API_URL } : { REVIEWS_SOURCE: 'mock' },
  },
});
