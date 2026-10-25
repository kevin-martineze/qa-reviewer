import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { changePasswordSchema, profileSchema } from '$lib/schemas/account';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { PASSWORD_MIN } from '$lib/schemas/password';
import { apiFail, failStatus, toastResult } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requireUser } from '$lib/server/guards';
import { clearSession } from '$lib/server/session';

export const load: PageServerLoad = async () => {
  return {
    meta: {
      title: 'Perfil',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Perfil' }],
      tab: 'profile',
    },
    passwordMin: PASSWORD_MIN,
  };
};

export const actions: Actions = {
  profile: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const raw = formObject(await request.formData(), ['name', 'avatar']);
    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { profileErrors: fieldErrors(parsed.error) });
    const result = await gateway(locals, fetch).auth.updateProfile(parsed.data);
    return toastResult(result, 'Perfil actualizado.');
  },

  password: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const raw = formObject(await request.formData(), ['current', 'password', 'confirm']);
    const parsed = changePasswordSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { passwordErrors: fieldErrors(parsed.error) });
    const result = await gateway(locals, fetch).auth.changePassword(
      parsed.data.current,
      parsed.data.password,
    );
    if (!result.ok) {
      // La contraseña actual equivocada se muestra junto a su campo.
      if (result.error.messageKey === 'auth.wrong_password') {
        return fail(failStatus(result.error.status), {
          passwordErrors: { current: result.error.message },
        });
      }
      return apiFail(result.error);
    }
    return { message: 'Contraseña actualizada.', passwordChanged: true };
  },

  everywhere: async ({ locals, fetch, cookies }) => {
    requireUser(locals);
    const result = await gateway(locals, fetch).auth.logoutEverywhere();
    if (!result.ok) return apiFail(result.error);
    clearSession(cookies);
    throw redirect(303, '/login?reason=everywhere');
  },
};
