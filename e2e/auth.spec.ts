import { expect, test } from '@playwright/test';

import { login } from './helpers';

test('sin sesión manda al login y vuelve a donde iba', async ({ page }) => {
  await page.goto('/reviews');
  await expect(page).toHaveURL(/\/login\?redirectTo=%2Freviews/);
  await login(page, 'laura.rios@ejemplo.co', '/reviews');
  await expect(page).toHaveURL('/reviews');
  await expect(page.getByRole('navigation', { name: 'Migas de pan' })).toContainText('Revisiones');
});

test('credenciales malas muestran el error sin perder el correo', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Correo').fill('laura.rios@ejemplo.co');
  await page.getByLabel('Contraseña', { exact: true }).fill('otra-cosa');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert')).toContainText('Correo o contraseña incorrectos.');
  await expect(page.getByLabel('Correo')).toHaveValue('laura.rios@ejemplo.co');
});

test('validación por campo', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Escribe un correo válido.')).toBeVisible();
  await expect(page.getByText('Escribe tu contraseña.')).toBeVisible();
});

test('aviso de sesión vencida', async ({ page }) => {
  await page.goto('/login?reason=expired');
  await expect(page.getByRole('status')).toContainText('Tu sesión venció');
});

test('redirectTo externo se ignora', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '//evil.example');
  await expect(page).toHaveURL('/');
});

test('cerrar sesión', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  await page.getByRole('button', { name: 'Menú de usuario' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL('/login?reason=logout');
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
});

test('invitación: estados y validación', async ({ page }) => {
  await page.goto('/invite/invite-expired-0001');
  await expect(page.getByText('La invitación venció.')).toBeVisible();

  await page.goto('/invite/no-existe');
  await expect(page.getByRole('heading', { name: 'No encontramos esto' })).toBeVisible();

  await page.goto('/invite/invite-valid-0001');
  await page.getByRole('button', { name: 'Aceptar y entrar' }).click();
  await expect(page.getByText('Escribe tu nombre.')).toBeVisible();
  await expect(page.getByText('Mínimo 12 caracteres.')).toBeVisible();
});

test('invitación: crear la cuenta con un avatar del banco', async ({ page }) => {
  await page.goto('/invite/invite-valid-0001');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Tu nombre').fill('Mariana Gómez');
  // La opción de iniciales sigue al nombre escrito.
  await expect(page.getByTitle('Usar iniciales')).toContainText('MG');
  // El radio es sr-only: se elige con clic en la imagen, como lo hace la persona.
  await page.getByTitle('Mujer de cabello rizado con blusa coral').click();
  await expect(
    page.getByRole('radio', { name: 'Mujer de cabello rizado con blusa coral' }),
  ).toBeChecked();
  await page.getByLabel('Contraseña', { exact: true }).fill('una-clave-bien-larga');
  await page.getByLabel('Confirma la contraseña').fill('una-clave-bien-larga');
  await page.getByRole('button', { name: 'Aceptar y entrar' }).click();
  await expect(page).not.toHaveURL(/\/invite/);
  const menu = page.getByRole('button', { name: 'Menú de usuario' });
  await expect(menu).toContainText('Mariana Gómez');
  await expect(menu.locator('img')).toHaveAttribute('src', /avatars\/a09\.webp$/);
});

test('recuperación: pedir enlace y enlace vencido', async ({ page }) => {
  await page.goto('/recover');
  await page.getByLabel('Correo').fill('kevin@ejemplo.co');
  await page.getByRole('button', { name: 'Enviar enlace' }).click();
  await expect(page.getByText('Revisa tu correo')).toBeVisible();

  await page.goto('/recover/recover-expired-0001');
  await expect(page.getByText('Este enlace venció.')).toBeVisible();
});
