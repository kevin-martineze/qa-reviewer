import { expect, type Page } from '@playwright/test';

/** Contraseña de las cuentas del mock (src/lib/server/adapters/mock/seeds.ts). */
export const DEMO_PASSWORD = 'demo1234';

export async function login(page: Page, email: string, redirectTo?: string): Promise<void> {
  const query = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : '';
  await page.goto(`/login${query}`);
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).not.toHaveURL(/\/login/);
  // Espera la hidratación: sin ella, un clic temprano no llega a los handlers.
  await page.waitForLoadState('networkidle');
}
