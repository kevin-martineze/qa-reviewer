import { expect, test } from '@playwright/test';

import { login } from './helpers';

test('admin ve métricas y organización', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co');
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  await expect(nav.getByRole('link', { name: 'Métricas' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Organización' })).toBeVisible();
});

test('developer no ve métricas ni organización', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  await expect(nav.getByRole('link', { name: 'Bandeja' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Métricas' })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: 'Organización' })).toHaveCount(0);
});

test('403 dentro del shell con el permiso que falta', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  await page.goto('/metrics');
  await expect(page.getByRole('heading', { name: 'No tienes acceso' })).toBeVisible();
  await expect(page.getByText('Ver métricas')).toBeVisible();
  // El sidebar sigue ahí para poder irse.
  await expect(page.getByRole('navigation', { name: 'Secciones' })).toBeVisible();
});

test('404 de una revisión que no existe', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  const res = await page.goto('/reviews/QR-9999');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'No encontramos esto' })).toBeVisible();
});

test('el sidebar colapsado se recuerda', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  await page.getByRole('button', { name: 'Colapsar la barra lateral' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Expandir la barra lateral' })).toBeVisible();
  await page.getByRole('button', { name: 'Expandir la barra lateral' }).click();
});

test('cambiar de proyecto desde una revisión vuelve al listado', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/reviews/QR-0011');
  await page.getByRole('button', { name: 'Cambiar de proyecto' }).click();
  await page.getByRole('menuitem', { name: 'Auralis' }).click();
  await expect(page).toHaveURL('/reviews');
});

test('abrir una notificación la marca como leída y lleva a su revisión', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  const bell = page.getByRole('button', { name: /^Notificaciones/ });
  await expect(bell).toHaveAccessibleName(/sin leer/);
  await bell.click();
  await page.getByRole('button', { name: /QR-0011 quedó asignada/ }).click();
  await expect(page).toHaveURL(/\/reviews\/QR-0011/);
  await expect(bell).toHaveAccessibleName('Notificaciones');
});
