import type { Handle } from '@sveltejs/kit';
import { permissionsOf } from '$lib/domain/permissions';
import { MEMBERS } from '$lib/server/adapters/mock/seeds';
import { readSession } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
  const user = readSession(event.cookies);
  if (user) {
    event.locals.user = user;
    event.locals.permissions = permissionsOf(user.orgRole, MEMBERS[user.id]);
  } else {
    event.locals.permissions = new Set();
  }
  return resolve(event);
};
