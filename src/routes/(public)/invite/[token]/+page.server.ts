import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { inviteSchema, PASSWORD_MIN } from '$lib/schemas/password';
import { gateway } from '$lib/server/gateway';
import { unwrap } from '$lib/server/guards';
import { setSession } from '$lib/server/session';

export const load: PageServerLoad = async ({ locals, params, fetch, url }) => {
  const invite = unwrap(await gateway(locals, fetch).auth.inviteInfo(params.token), url);
  return {
    meta: {
      title: invite.status === 'valid' ? `Únete a ${invite.org}` : 'Invitación no disponible',
      description:
        invite.status === 'valid' ? `${invite.inviter} te invitó a revisar pantallas.` : undefined,
    },
    invite,
    passwordMin: PASSWORD_MIN,
  };
};

export const actions: Actions = {
  default: async ({ request, params, cookies, locals, fetch }) => {
    const raw = formObject(await request.formData(), ['name', 'password', 'confirm']);
    const parsed = inviteSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { name: raw.name, errors: fieldErrors(parsed.error) });

    const result = await gateway(locals, fetch).auth.acceptInvite(
      params.token,
      parsed.data.name,
      parsed.data.password,
    );
    if (!result.ok) {
      return fail(result.error.status || 400, { name: raw.name, error: result.error.message });
    }

    setSession(cookies, result.data.token);
    throw redirect(303, '/');
  },
};
