import type { LayoutServerLoad } from './$types';
import { requireUser } from '$lib/server/guards';

/** `hooks.server.ts` ya manda al login a quien no tenga sesión; aquí solo se muestra quién es. */
export const load: LayoutServerLoad = async ({ locals }) => {
  const user = requireUser(locals);
  return { account: { name: user.name, email: user.email } };
};
