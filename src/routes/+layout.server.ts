import { MEMBERS } from '$lib/server/adapters/mock/seeds';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
    permissions: [...locals.permissions],
    projectRole: locals.user ? MEMBERS[locals.user.id] : undefined,
  };
};
