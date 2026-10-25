import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { safeRedirectTo } from '$lib/domain/security';

/** Con sesión no tiene sentido ver login, invitación ni recuperación. */
export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (locals.user) throw redirect(303, safeRedirectTo(url.searchParams.get('redirectTo')) ?? '/');
};
