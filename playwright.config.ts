import { defineConfig, devices } from '@playwright/test';

// E2E contra el mock (REVIEWS_SOURCE=mock). El mock guarda estado en memoria
// dentro del server, así que los specs corren en serie con un solo worker.
const PORT = 4317;

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
    env: { REVIEWS_SOURCE: 'mock' },
  },
});
