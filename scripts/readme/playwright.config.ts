import { defineConfig, devices } from '@playwright/test';

// Capturas del README contra el mock (datos sintéticos). No es una prueba:
//   pnpm readme:shots   →   docs/assets/screens/*.png
const PORT = 4318;

export default defineConfig({
  testDir: '.',
  testMatch: 'shots.ts',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        channel: process.env.PW_CHANNEL ?? 'chrome',
      },
    },
  ],
  webServer: {
    command: `pnpm vite dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/login`,
    timeout: 120_000,
    cwd: '../..',
    reuseExistingServer: false,
    env: { REVIEWS_SOURCE: 'mock' },
  },
});
