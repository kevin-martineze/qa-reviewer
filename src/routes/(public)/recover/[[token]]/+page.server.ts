import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { recoverRequestSchema } from '$lib/schemas/auth';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { PASSWORD_MIN, passwordFormSchema } from '$lib/schemas/password';
import { gateway } from '$lib/server/gateway';
import { unwrap } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals, params, fetch, url }) => {
  if (!params.token) {
    return {
      mode: 'request' as const,
      status: null,
      passwordMin: PASSWORD_MIN,
      meta: {
        title: 'Recupera tu contraseña',
        description: 'Te enviamos un enlace para definir una nueva.',
      },
    };
  }
  const info = unwrap(await gateway(locals, fetch).auth.recoveryInfo(params.token), url);
  return {
    mode: 'reset' as const,
    status: info.status,
    passwordMin: PASSWORD_MIN,
    meta: {
      title: info.status === 'valid' ? 'Define una contraseña nueva' : 'Enlace no disponible',
    },
  };
};

export const actions: Actions = {
  request: async ({ request, locals, fetch }) => {
    const raw = formObject(await request.formData(), ['email']);
    const parsed = recoverRequestSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { email: raw.email, errors: fieldErrors(parsed.error) });
    const result = await gateway(locals, fetch).auth.requestRecovery(parsed.data.email);
    if (!result.ok)
      return fail(result.error.status || 400, { email: raw.email, error: result.error.message });
    return { sent: parsed.data.email };
  },

  reset: async ({ request, params, locals, fetch }) => {
    if (!params.token) return fail(400, { error: 'Falta el enlace de recuperación.' });
    const raw = formObject(await request.formData(), ['password', 'confirm']);
    const parsed = passwordFormSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { errors: fieldErrors(parsed.error) });
    const result = await gateway(locals, fetch).auth.resetPassword(
      params.token,
      parsed.data.password,
    );
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    throw redirect(303, '/login?reason=password_reset');
  },
};
