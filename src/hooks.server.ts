import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { permissionsFor } from '$lib/domain/permissions';
import { newErrorId } from '$lib/server/error-report';
import { gateway } from '$lib/server/gateway';
import { clearSession, PROJECT_COOKIE, SESSION_COOKIE } from '$lib/server/session';
import type { SessionUser } from '$lib/api/types';

/** Grupos de rutas que exigen sesión: sin ella, al login con `redirectTo`. */
const SESSION_GROUPS = ['/(app)/', '/(device)/'];

function activeProject(user: SessionUser, requested: string | undefined): string | null {
  const mine = user.memberships.map((m) => m.projectId);
  const isOrgAdmin = user.orgRole === 'owner' || user.orgRole === 'admin';
  if (requested && (isOrgAdmin || mine.includes(requested))) return requested;
  return mine[0] ?? null;
}

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE);
  event.locals.sessionToken = token;
  event.locals.projectId = null;
  event.locals.permissions = new Set();

  if (token) {
    const me = await gateway(event.locals, event.fetch).auth.me();
    if (me.ok) {
      event.locals.user = me.data;
      event.locals.projectId = activeProject(me.data, event.cookies.get(PROJECT_COOKIE));
      event.locals.permissions = permissionsFor(me.data, event.locals.projectId);
    } else if (me.error.status === 401) {
      event.locals.sessionToken = undefined;
      clearSession(event.cookies);
    }
  }

  const routeId = event.route.id ?? '';
  if (!event.locals.user && SESSION_GROUPS.some((g) => `${routeId}/`.startsWith(g))) {
    const params = new URLSearchParams({ redirectTo: event.url.pathname + event.url.search });
    if (token) params.set('reason', 'expired');
    throw redirect(303, `/login?${params.toString()}`);
  }

  return resolve(event);
};

export const handleError: HandleServerError = async ({ error, status }) => {
  if (status === 404) return { message: 'No encontramos esta página.', code: 'not_found' };
  const errorId = newErrorId();
  const message = error instanceof Error ? error.message : 'Error desconocido';
  console.error(`[${errorId}]`, message);
  return { message: 'Algo salió mal.', errorId, code: 'error' };
};
