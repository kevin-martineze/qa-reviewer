import { expect, test, type APIRequestContext } from '@playwright/test';

import { DEMO_PASSWORD, login } from './helpers';

const API_URL = process.env.E2E_API_URL;

/**
 * Código de un dispositivo pendiente. Contra el mock, uno de las semillas; contra el API,
 * uno nuevo pedido como lo hace la skill (`POST /skill/device`, público).
 */
async function pendingCode(
  request: APIRequestContext,
  seeded: string,
  repo: string | null,
): Promise<string> {
  if (!API_URL) return seeded;
  const response = await request.post(`${API_URL}/skill/device`, {
    data: { client: { name: 'design-review-skill', version: '0.1.0', hostname: 'e2e' }, repo },
  });
  expect(response.ok()).toBeTruthy();
  const body: { data: { userCode: string } } = await response.json();
  return body.data.userCode;
}

test('sin sesión pasa por el login y vuelve a autorizar la skill', async ({ page, request }) => {
  const code = await pendingCode(request, 'WXYZ-2345', 'estudio-norte/lideris-v2');
  await page.goto(`/device?code=${code}`);
  await expect(page).toHaveURL(/\/login\?redirectTo=/);

  await page.getByLabel('Correo').fill('kevin@ejemplo.co');
  await page.getByLabel('Contraseña', { exact: true }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/device\?code=/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByTestId('device-code')).toHaveText(code);
  // El repo de la skill sugiere el proyecto.
  await expect(page.getByLabel('Proyecto')).toContainText('Lideris');
  await expect(page.getByLabel('Nombre del token')).toHaveValue(/^Claude Code · /);

  await page.getByRole('button', { name: 'Autorizar' }).click();
  await expect(page.getByText('Vuelve a la terminal')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Autorizar' })).toHaveCount(0);
});

test('rechazar deja el código cerrado', async ({ page, request }) => {
  const code = await pendingCode(request, 'KMNP-6789', null);
  await login(page, 'kevin@ejemplo.co', `/device?code=${code.toLowerCase()}`);
  await expect(page.getByTestId('device-code')).toHaveText(code);
  await page.getByRole('button', { name: 'Rechazar' }).click();
  await expect(page.getByText('Acceso rechazado')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Acceso rechazado')).toBeVisible();
});

test('sin rol para publicar solo puede rechazar', async ({ page, request }) => {
  const code = await pendingCode(request, 'RSTU-5678', 'estudio-norte/auralis-admin');
  await login(page, 'camila.torres@ejemplo.co', `/device?code=${code}`);
  await expect(page.getByText('Solo desarrolladores y admins de proyecto')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Autorizar' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Rechazar' })).toBeVisible();
});

test('un código mal escrito o inexistente se marca en el campo', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co', '/device');
  const field = page.getByLabel('Código');
  await field.fill('abc');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByText('El código tiene 8 letras y números')).toBeVisible();

  await page.getByLabel('Código').fill('ZZZZ-9999');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page).toHaveURL(/code=ZZZZ-9999/);
  await expect(page.getByLabel('Código')).toHaveAttribute('aria-invalid', 'true');
});

test('un código vencido pide correr la skill otra vez', async ({ page }) => {
  test.skip(Boolean(API_URL), 'El API no deja crear un código ya vencido.');
  await login(page, 'kevin@ejemplo.co', '/device?code=HJKL-3456');
  await expect(page.getByText('El código venció')).toBeVisible();
});
