import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { permissionsOf } from '$lib/domain/permissions';
import { MEMBERS } from '$lib/server/adapters/mock/seeds';
import { newErrorId } from '$lib/server/error-report';
import { readSession, SESSION_COOKIE } from '$lib/server/session';

const APP_PREFIX = '/(app)';

export const handle: Handle = async ({ event, resolve }) => {
  const user = readSession(event.cookies);
  if (user) {
    event.locals.user = user;
    event.locals.permissions = permissionsOf(user.orgRole, MEMBERS[user.id]);
    return resolve(event);
  }

  event.locals.permissions = new Set();
  if (event.route.id?.startsWith(APP_PREFIX)) {
    const redirectTo = event.url.pathname + event.url.search;
    const params = new URLSearchParams({ redirectTo });
    if (event.cookies.get(SESSION_COOKIE) !== undefined) params.set('reason', 'expired');
    throw redirect(303, `/login?${params.toString()}`);
  }
  return resolve(event);
};

export const handleError: HandleServerError = async ({ error }) => {
  const errorId = newErrorId();
  const message = error instanceof Error ? error.message : 'Error desconocido';
  console.error(`[${errorId}]`, message);
  return { message: 'Algo salió mal.', errorId };
};
