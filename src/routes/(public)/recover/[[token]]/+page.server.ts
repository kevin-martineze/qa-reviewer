import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';

export const load: PageServerLoad = async ({ locals, params }) => {
  const token = params.token;
  if (!token) {
    return { meta: { title: 'Recuperar contraseña' } };
  }
  const result = await gateway(locals).auth.recoveryInfo(token);
  if (!result.ok) {
    throw error(result.error.status ?? 500, { message: result.error.message, code: 'not_found' });
  }
  return { meta: { title: 'Definir contraseña nueva' }, recovery: result.data };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const data = await request.formData();
    const token = params.token;

    if (!token) {
      const email = String(data.get('email') ?? '').trim();
      if (!email) return fail(400, { error: 'Escribe tu correo.' });
      const result = await gateway(locals).auth.requestRecovery(email);
      if (!result.ok) return fail(result.error.status ?? 400, { error: result.error.message });
      return { sent: true };
    }

    const password = String(data.get('password') ?? '');
    const confirm = String(data.get('confirm') ?? '');
    if (password.length < 8) {
      return fail(400, { error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (password !== confirm) return fail(400, { error: 'Las contraseñas no coinciden.' });

    const result = await gateway(locals).auth.resetPassword(token, password);
    if (!result.ok) return fail(result.error.status ?? 400, { error: result.error.message });

    throw redirect(303, '/login');
  },
};
