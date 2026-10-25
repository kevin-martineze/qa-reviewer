import { expect, test } from '@playwright/test';

import { login } from './helpers';

test('bandeja por rol: líder de diseño', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co');
  await expect(page.getByRole('heading', { name: 'Te toca revisar' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Vencidas del equipo' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Corrección del director/ })).toBeVisible();
});

test('bandeja por rol: developer ve lo que subió', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  await expect(page.getByRole('heading', { name: 'Tus revisiones' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Te toca revisar' })).toHaveCount(0);
});

test('bandeja por rol: lectora ve lo que está en curso', async ({ page }) => {
  await login(page, 'camila.torres@ejemplo.co');
  await expect(page.getByRole('heading', { name: 'En curso en el proyecto' })).toBeVisible();
});

test('los filtros viven en la URL', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/reviews');
  await page.getByRole('link', { name: /^Todas/ }).click();
  await expect(page).toHaveURL('/reviews?view=all');
  await expect(page.getByText('1–10 de 11')).toBeVisible();

  await page.getByRole('link', { name: 'Página siguiente' }).click();
  await expect(page).toHaveURL('/reviews?view=all&page=2');
  await expect(page.getByText('11–11 de 11')).toBeVisible();

  await page.getByRole('button', { name: 'Solo vencidas' }).click();
  await expect(page).toHaveURL('/reviews?view=all&overdue=1');
  await expect(page.getByRole('link', { name: /Corrección del director/ })).toBeVisible();

  await page.getByRole('searchbox', { name: 'Buscar revisiones' }).fill('nada-coincide');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Nada coincide con los filtros')).toBeVisible();

  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(page).toHaveURL('/reviews?view=all');

  await page.goBack();
  await expect(page).toHaveURL(/q=nada-coincide/);
});

test('notificaciones: pestañas y marcar todas', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/notifications');
  await expect(page.getByRole('heading', { name: 'Hoy' })).toBeVisible();

  await page.getByRole('link', { name: 'Menciones' }).click();
  await expect(page).toHaveURL('/notifications?tab=mentions');
  await expect(page.getByRole('button', { name: /te mencionó/ })).toBeVisible();

  await page.getByRole('button', { name: 'Marcar todas como leídas' }).click();
  await page.getByRole('link', { name: /No leídas/ }).click();
  await expect(page.getByText('Estás al día')).toBeVisible();
});
