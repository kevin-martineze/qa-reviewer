import type { Cookies } from '@sveltejs/kit';
import type { SessionUser } from '$lib/api/types';
import { USERS } from './adapters/mock/seeds';

export const SESSION_COOKIE = 'qa_session';

function userById(id: string): SessionUser | null {
  const user = USERS[id];
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    orgRole: user.orgRole,
    status: user.status,
  };
}

export function readSession(cookies: Cookies): SessionUser | null {
  const id = cookies.get(SESSION_COOKIE);
  if (!id) return null;
  return userById(id);
}
