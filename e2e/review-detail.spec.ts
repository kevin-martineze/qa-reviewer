import { expect, test } from '@playwright/test';

import { login } from './helpers';

test('pestañas del detalle con su URL', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/reviews/QR-0012');
  await expect(
    page.getByRole('heading', { name: 'Edición en bloque de las cantidades aprobadas' }),
  ).toBeVisible();
  await expect(page.getByText('Ronda 2: Kevin Martínez subió cambios')).toBeVisible();

  for (const [tab, path, text] of [
    ['Resumen', '/summary', 'Reglas de negocio'],
    ['Rondas', '/rounds', 'Ronda 1'],
    ['Para Claude Code', '/feedback', '/design-review status QR-0012'],
    ['Actividad', '/activity', 'publicó la revisión'],
    ['Rama y PR', '/branch', 'Pull request #868'],
  ] as const) {
    await page.getByRole('link', { name: new RegExp(`^${tab}`) }).click();
    await expect(page).toHaveURL(`/reviews/QR-0012${path}`);
    await expect(page.getByText(text).first()).toBeVisible();
  }
});

test('filtro «solo lo que cambió»', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/reviews/QR-0012');
  await expect(page.getByRole('link', { name: /Vista normal/ })).toBeVisible();
  await page.getByRole('link', { name: 'Cambiaron en la ronda 2 (4)' }).click();
  await expect(page).toHaveURL('/reviews/QR-0012?changed=1');
  await expect(page.getByRole('link', { name: /Vista normal/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Filas modificadas/ })).toBeVisible();
});

test('el autor no ve la barra de envío', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co', '/reviews/QR-0012');
  await expect(page.getByRole('heading', { name: /Edición en bloque/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar revisión' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Asignar/ })).toHaveCount(0);
});

test('la líder cambia la prioridad', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/reviews/QR-0012');
  await page.getByRole('button', { name: /^Prioridad: Media/ }).click();
  await page.getByRole('button', { name: 'Alta' }).click();
  await expect(page.getByText('Prioridad actualizada.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Prioridad: Alta/ })).toBeVisible();
});

test('reabrir un envío y volver a enviarlo', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', '/reviews/QR-0010');
  await expect(page.getByText(/pidió ajustes en 1 pantalla/)).toBeVisible();

  await page.getByRole('button', { name: 'Reabrir el envío' }).click();
  await page.getByLabel('Motivo').fill('Quiero revisar otra vez la alerta.');
  await page.getByRole('button', { name: 'Reabrir', exact: true }).click();
  await expect(page.getByText('Envío reabierto.')).toBeVisible();

  // Con los veredictos completos, la barra deja enviar de nuevo.
  await page.getByRole('button', { name: 'Enviar revisión' }).click();
  await page.getByLabel('Mensaje para el autor (opcional)').fill('Sigue faltando el ícono.');
  await page.getByRole('button', { name: 'Enviar ajustes' }).click();
  await expect(page.getByText('Ajustes enviados al autor.')).toBeVisible();
  await expect(page.getByText('«Sigue faltando el ícono.»')).toBeVisible();
});
