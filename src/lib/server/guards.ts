import { error, redirect } from '@sveltejs/kit';
import type { ApiError, Result } from '$lib/api/result';
import type { SessionUser } from '$lib/api/types';
import { permissionsFor, type Permission } from '$lib/domain/permissions';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function permissionOf(details: unknown): string | undefined {
  if (isRecord(details) && typeof details.permission === 'string') return details.permission;
  return undefined;
}

export function requireUser(locals: App.Locals): SessionUser {
  if (!locals.user) throw redirect(303, '/login');
  return locals.user;
}

/**
 * Corta con 403 si el usuario no tiene el permiso. Sin `projectId` usa el proyecto activo.
 * Úsalo en el load del segmento (UX) y otra vez en cada action (seguridad, layouts.md regla 6).
 */
export function requirePermission(
  locals: App.Locals,
  permission: Permission,
  projectId?: string | null,
): SessionUser {
  const user = requireUser(locals);
  const perms = projectId === undefined ? locals.permissions : permissionsFor(user, projectId);
  if (!perms.has(permission)) {
    throw error(403, {
      message: 'No tienes permiso para ver esta página.',
      code: 'forbidden',
      permission,
    });
  }
  return user;
}

/** Traduce un error del API a la respuesta de SvelteKit que corresponde. */
export function throwApiError(e: ApiError, url?: URL): never {
  if (e.status === 401) {
    const params = new URLSearchParams({ reason: 'expired' });
    if (url) params.set('redirectTo', url.pathname + url.search);
    throw redirect(303, `/login?${params.toString()}`);
  }
  if (e.status === 403) {
    throw error(403, {
      message: e.message,
      code: 'forbidden',
      permission: permissionOf(e.details),
    });
  }
  if (e.status === 404) throw error(404, { message: e.message, code: 'not_found' });
  if (e.status === 410) throw error(410, { message: e.message, code: 'gone' });
  if (e.status === 503) throw error(503, { message: e.message, code: 'unavailable' });
  throw error(e.status >= 400 && e.status < 600 ? e.status : 500, {
    message: e.message,
    code: 'error',
  });
}

/** Para loads: devuelve el dato o corta con el error que corresponde. */
export function unwrap<T>(result: Result<T>, url?: URL): T {
  if (!result.ok) throwApiError(result.error, url);
  return result.data;
}
