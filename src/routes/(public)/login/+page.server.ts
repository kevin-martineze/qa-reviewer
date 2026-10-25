import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { gateway } from '$lib/server/gateway';
import { SESSION_COOKIE } from '$lib/server/session';

export const actions: Actions = {
  default: async ({ request, cookies, locals }) => {
    const data = await request.formData();
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    const result = await gateway(locals).auth.login(email, password);
    if (!result.ok) {
      return fail(result.error.status ?? 400, { email, error: result.error.message });
    }

    cookies.set(SESSION_COOKIE, result.data.id, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(303, '/');
  },
};
