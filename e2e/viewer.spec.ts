import { expect, test } from '@playwright/test';

import { login } from './helpers';

const SCREEN = '/reviews/QR-0012/screens';

test('comparar con la ronda anterior y cambiar de modo', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', `${SCREEN}/c`);
  await expect(page.getByText('Filas modificadas').first()).toBeVisible();

  await page.getByRole('button', { name: 'vs Ronda 1' }).click();
  await expect(page).toHaveURL(`${SCREEN}/c?compare=previous`);
  await expect(page.getByRole('img', { name: 'Ronda 1' })).toBeVisible();

  await page.getByRole('button', { name: 'Deslizador' }).click();
  await expect(page).toHaveURL(`${SCREEN}/c?compare=previous&mode=slider`);
  await expect(page.getByRole('slider')).toBeVisible();

  await page.getByRole('button', { name: 'Sin comparar' }).click();
  await expect(page).toHaveURL(`${SCREEN}/c`);
});

test('navegar entre pantallas con el teclado', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', `${SCREEN}/c`);
  await expect(page.getByText('3 de 7')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(`${SCREEN}/d`);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(`${SCREEN}/c`);
});

test('comentar un componente con ancla', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', `${SCREEN}/e`);
  await expect(page.getByText('Sin comentarios')).toBeVisible();

  await page.keyboard.press('c');
  await page.getByRole('img', { name: /^Captura:/ }).click({ position: { x: 200, y: 200 } });
  await page.getByLabel('Comentario', { exact: true }).fill('Más aire entre las filas.');
  await page.getByRole('button', { name: 'Comentar', exact: true }).last().click();

  await expect(page.getByText('Comentario publicado.')).toBeVisible();
  await expect(page.getByText('Más aire entre las filas.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Comentario 1' })).toBeVisible();
});

test('el comentario vacío muestra el error', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', `${SCREEN}/f`);
  await page.getByRole('button', { name: 'General' }).click();
  await page.getByLabel('Comentario', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'Comentar', exact: true }).last().click();
  await expect(page.getByLabel('Comentario', { exact: true })).toBeVisible();
});

test('veredicto con atajo y seguimiento de un comentario', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co', `${SCREEN}/c`);
  await page.keyboard.press('r');
  await expect(page.getByRole('button', { name: /Pedir ajuste/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await expect(page.getByText('¿Quedó resuelto en la ronda 2?')).toBeVisible();
  await page.getByRole('button', { name: 'Sí, resuelto' }).click();
  await expect(page.getByText('Marcado como resuelto.')).toBeVisible();
  await expect(page.getByText('¿Quedó resuelto en la ronda 2?')).toHaveCount(0);
});

test('el autor no puede dar veredicto', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co', `${SCREEN}/c`);
  await expect(page.getByText('Eres el autor: el veredicto lo da diseño.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Aprobar/ })).toBeDisabled();
});
