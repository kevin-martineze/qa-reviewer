import { expect, test } from '@playwright/test';

test.describe('bloqueo bajo lg', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('/login muestra el aviso y no el form', async ({ page }) => {
    await page.goto('/login');
    await expect(
      page.getByRole('heading', { name: 'Disponible solo en computador' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).not.toBeVisible();
  });

  test('una ruta protegida también muestra el aviso', async ({ page }) => {
    await page.goto('/reviews');
    await expect(
      page.getByRole('heading', { name: 'Disponible solo en computador' }),
    ).toBeVisible();
  });

  test('una ruta inexistente muestra el aviso, no el error', async ({ page }) => {
    await page.goto('/no-existe');
    await expect(
      page.getByRole('heading', { name: 'Disponible solo en computador' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No encontramos esto' })).not.toBeVisible();
  });
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('el aviso no aparece y el login sí', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Disponible solo en computador')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });
});
