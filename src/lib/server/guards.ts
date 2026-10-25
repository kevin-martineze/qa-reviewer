import { error, redirect } from '@sveltejs/kit';
import type { SessionUser } from '$lib/api/types';
import type { Permission } from '$lib/domain/permissions';

export function requireUser(locals: App.Locals): SessionUser {
  if (!locals.user) throw redirect(303, '/login');
  return locals.user;
}

export function requirePermission(locals: App.Locals, permission: Permission): SessionUser {
  const user = requireUser(locals);
  if (!locals.permissions.has(permission)) {
    throw error(403, 'No tienes permiso para acceder a esta página.');
  }
  return user;
}
