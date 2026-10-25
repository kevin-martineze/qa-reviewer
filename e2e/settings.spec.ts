import { expect, test } from '@playwright/test';

import { login } from './helpers';

const ADMIN = 'laura.rios@ejemplo.co';
const DEV = 'kevin@ejemplo.co';

test.describe('organización', () => {
  test('invitar a una persona', async ({ page }) => {
    await login(page, ADMIN, '/admin/users');
    await page.getByRole('button', { name: 'Invitar' }).click();
    await page.getByLabel('Correo').fill('nueva.persona@ejemplo.co');
    await page.getByLabel('Rol en Lideris').click();
    await page.getByRole('option', { name: 'Diseñador' }).click();
    await page.getByRole('button', { name: 'Enviar invitación' }).click();
    await expect(page.getByText('Invitación enviada a nueva.persona@ejemplo.co.')).toBeVisible();
    await expect(
      page.getByRole('region', { name: 'Invitaciones' }).getByText('nueva.persona@ejemplo.co'),
    ).toBeVisible();
  });

  test('un correo ya registrado se marca en el campo', async ({ page }) => {
    await login(page, ADMIN, '/admin/users');
    await page.getByRole('button', { name: 'Invitar' }).click();
    await page.getByLabel('Correo').fill(DEV);
    await page.getByRole('button', { name: 'Enviar invitación' }).click();
    await expect(page.getByText('Ya hay un usuario con ese correo.')).toBeVisible();
  });

  test('desactivar a una persona', async ({ page }) => {
    await login(page, ADMIN, '/admin/users');
    await page.getByRole('button', { name: 'Acciones para Camila Torres' }).click();
    await page.getByRole('menuitem', { name: 'Desactivar' }).click();
    await page.getByRole('button', { name: 'Desactivar', exact: true }).click();
    await expect(page.getByText(/Camila Torres quedó desactivado/)).toBeVisible();
    await page.getByRole('link', { name: /^Desactivados/ }).click();
    await expect(page).toHaveURL('/admin/users?status=inactive');
    await expect(page.getByText('camila.torres@ejemplo.co')).toBeVisible();
  });

  test('roles y auditoría', async ({ page }) => {
    await login(page, ADMIN, '/admin/roles');
    await expect(page.getByRole('table', { name: 'Permisos por rol de proyecto' })).toBeVisible();
    await page.goto('/admin/audit?type=user_deactivated');
    await expect(page.getByText(/desactivó a Julián Ospina/)).toBeVisible();
  });

  test('un miembro sin permisos no entra a la organización', async ({ page }) => {
    await login(page, DEV, '/admin/users');
    await expect(page.getByText('No tienes permiso para ver esta página.')).toBeVisible();
  });
});

test.describe('proyecto', () => {
  test('SLA valida el rango y guarda', async ({ page }) => {
    await login(page, ADMIN, '/projects/lideris/settings/sla');
    await page.getByLabel('Días hábiles').fill('0');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Mínimo 1 día.')).toBeVisible();
    await page.getByLabel('Días hábiles').fill('4');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('SLA actualizado.')).toBeVisible();
    await expect(page.getByLabel('Días hábiles')).toHaveValue('4');
  });

  test('agregar un miembro', async ({ page }) => {
    await login(page, ADMIN, '/projects/auralis/settings/members');
    await page.getByRole('button', { name: 'Agregar' }).click();
    await page.getByLabel('Persona').click();
    await page.getByRole('option', { name: /Sofía Vargas/ }).click();
    await page.getByRole('button', { name: 'Agregar', exact: true }).last().click();
    await expect(page.getByText('Miembro agregado.')).toBeVisible();
    await expect(page.getByText('sofia.vargas@ejemplo.co')).toBeVisible();
  });

  test('agregar una regla de asignación por módulo', async ({ page }) => {
    await login(page, ADMIN, '/projects/lideris/settings/assignment');
    await page.getByRole('button', { name: 'Agregar regla' }).click();
    await page.getByLabel('Ruta de la regla 5').fill('/quotes/*');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Asignación actualizada.')).toBeVisible();
    await expect(page.getByLabel('Ruta de la regla 5')).toHaveValue('/quotes/*');
  });

  test('una ruta sin barra se marca en su fila', async ({ page }) => {
    await login(page, ADMIN, '/projects/lideris/settings/assignment');
    await page.getByLabel('Ruta de la regla 1').fill('preorders');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(
      page.getByText('La ruta empieza con / y no lleva espacios.').first(),
    ).toBeVisible();
  });

  test('integraciones guardan los switches', async ({ page }) => {
    await login(page, ADMIN, '/projects/lideris/settings/integrations');
    const toggle = page.getByRole('switch', { name: 'Comentar en el PR al enviar' });
    await expect(toggle).toBeChecked();
    await toggle.click();
    await page.getByRole('button', { name: 'Guardar integraciones' }).click();
    await expect(page.getByText('Integraciones actualizadas.')).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('switch', { name: 'Comentar en el PR al enviar' }),
    ).not.toBeChecked();
  });
});

test.describe('cuenta', () => {
  test('perfil y contraseña', async ({ page }) => {
    await login(page, DEV, '/settings/profile');
    await page.getByLabel('Nombre').fill('Kevin M.');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Perfil actualizado.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menú de usuario' })).toContainText('Kevin M.');

    await page.getByLabel('Contraseña actual').fill('no-es-esta');
    await page.getByLabel('Contraseña nueva', { exact: true }).fill('una-clave-bien-larga');
    await page.getByLabel('Confirma la contraseña nueva').fill('una-clave-bien-larga');
    await page.getByRole('button', { name: 'Cambiar contraseña' }).click();
    await expect(page.getByText('La contraseña actual no coincide.')).toBeVisible();
  });

  test('preferencias de correo', async ({ page }) => {
    await login(page, DEV, '/settings/notifications');
    const mention = page.getByRole('switch', { name: 'Mención' });
    const before = await mention.isChecked();
    await mention.click();
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Preferencias guardadas.')).toBeVisible();
    await page.reload();
    if (before) await expect(page.getByRole('switch', { name: 'Mención' })).not.toBeChecked();
    else await expect(page.getByRole('switch', { name: 'Mención' })).toBeChecked();
  });

  test('crear un token lo muestra una vez y se puede revocar', async ({ page }) => {
    await login(page, DEV, '/settings/tokens');
    await page.getByRole('button', { name: 'Crear token' }).first().click();
    await page.getByLabel('Nombre').fill('Laptop e2e');
    await page.getByRole('combobox', { name: 'Proyecto' }).click();
    await page.getByRole('option', { name: 'Lideris' }).click();
    await page.getByRole('button', { name: 'Crear token', exact: true }).last().click();
    await expect(page.getByTestId('token-secret')).toHaveText(/^qa_pat_[0-9a-f]{32}$/);
    await page.getByRole('button', { name: 'Ya lo copié' }).click();

    await page.getByRole('button', { name: 'Revocar Laptop e2e' }).click();
    await page.getByRole('button', { name: 'Revocar', exact: true }).click();
    await expect(page.getByText(/Token revocado/)).toBeVisible();
    await expect(page.getByText('Laptop e2e')).toHaveCount(0);
  });
});

test('métricas con filtros en la URL', async ({ page }) => {
  await login(page, ADMIN, '/metrics');
  await expect(page.getByText('Hasta el primer envío')).toBeVisible();
  await expect(page.getByRole('img', { name: /abiertas y aprobadas por semana/i })).toBeVisible();
  await page.getByRole('combobox', { name: 'Periodo' }).click();
  await page.getByRole('option', { name: 'Últimos 30 días' }).click();
  await expect(page).toHaveURL('/metrics?range=30');
});
