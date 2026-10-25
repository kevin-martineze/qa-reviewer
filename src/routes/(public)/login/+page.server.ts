import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { safeRedirectTo } from '$lib/domain/security';
import { loginSchema } from '$lib/schemas/auth';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { demoAccounts } from '$lib/server/adapters/mock/demo';
import { gateway, isMock } from '$lib/server/gateway';
import { setSession } from '$lib/server/session';

const REASONS = {
  expired: { tone: 'warning', text: 'Tu sesión venció. Vuelve a entrar para seguir.' },
  logout: { tone: 'info', text: 'Cerraste sesión.' },
  password_reset: { tone: 'success', text: 'Listo, ya puedes entrar con tu contraseña nueva.' },
} as const;

function isReason(value: string | null): value is keyof typeof REASONS {
  return value !== null && value in REASONS;
}

export const load: PageServerLoad = async ({ url }) => {
  const reason = url.searchParams.get('reason');
  return {
    meta: {
      title: 'Inicia sesión',
      description: 'Entra para revisar las pantallas que te asignaron.',
    },
    redirectTo: safeRedirectTo(url.searchParams.get('redirectTo')),
    notice: isReason(reason) ? REASONS[reason] : null,
    demo: isMock ? demoAccounts() : null,
  };
};

export const actions: Actions = {
  default: async ({ request, cookies, locals, fetch }) => {
    const data = await request.formData();
    const raw = formObject(data, ['email', 'password', 'redirectTo']);
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { email: raw.email, errors: fieldErrors(parsed.error) });

    const result = await gateway(locals, fetch).auth.login(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      const status = result.error.status === 401 ? 400 : result.error.status || 400;
      return fail(status, { email: raw.email, error: result.error.message });
    }

    setSession(cookies, result.data.token);
    throw redirect(303, safeRedirectTo(raw.redirectTo) ?? '/');
  },
};
