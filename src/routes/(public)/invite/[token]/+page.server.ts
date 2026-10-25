import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';
import { SESSION_COOKIE } from '$lib/server/session';

export const load: PageServerLoad = async ({ locals, params }) => {
  const result = await gateway(locals).auth.inviteInfo(params.token);
  if (!result.ok) {
    throw error(result.error.status ?? 500, { message: result.error.message, code: 'not_found' });
  }
  return { meta: { title: 'Aceptar invitación' }, invite: result.data };
};

export const actions: Actions = {
  default: async ({ request, params, cookies, locals }) => {
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const confirm = String(data.get('confirm') ?? '');

    if (!name) return fail(400, { name, error: 'Escribe tu nombre.' });
    if (password.length < 8) {
      return fail(400, { name, error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (password !== confirm) return fail(400, { name, error: 'Las contraseñas no coinciden.' });

    const result = await gateway(locals).auth.acceptInvite(params.token, name, password);
    if (!result.ok) return fail(result.error.status ?? 400, { name, error: result.error.message });

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
