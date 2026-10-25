import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { permissionsFor } from '$lib/domain/permissions';
import { tokenSchema } from '$lib/schemas/account';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { apiFail, field, toastResult } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requirePermission, requireUser, unwrap } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals, fetch, url, parent }) => {
  const user = requireUser(locals);
  const { projects } = await parent();
  const tokens = unwrap(await gateway(locals, fetch).tokens.list(), url);
  return {
    meta: {
      title: 'Tokens de la skill',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Tokens' }],
      tab: 'tokens',
    },
    tokens,
    /** Proyectos donde la persona puede publicar con la skill. */
    tokenProjects: projects
      .filter((p) => permissionsFor(user, p.id).has('tokens:own'))
      .map((p) => ({ value: p.id, label: p.name })),
    projectNames: Object.fromEntries(projects.map((p) => [p.id, p.name])),
  };
};

export const actions: Actions = {
  create: async ({ request, locals, fetch }) => {
    const raw = formObject(await request.formData(), ['label', 'projectId']);
    const parsed = tokenSchema.safeParse(raw);
    if (!parsed.success)
      return fail(400, { tokenErrors: fieldErrors(parsed.error), label: raw.label });
    requirePermission(locals, 'tokens:own', parsed.data.projectId);
    const result = await gateway(locals, fetch).tokens.create(
      parsed.data.projectId,
      parsed.data.label,
    );
    if (!result.ok) return apiFail(result.error);
    // El secreto viaja solo en esta respuesta; el API no lo vuelve a entregar.
    return { created: { label: result.data.token.label, secret: result.data.secret } };
  },

  revoke: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const id = field(await request.formData(), 'id');
    const result = await gateway(locals, fetch).tokens.revoke(id);
    return toastResult(result, 'Token revocado. La skill deja de funcionar con él.');
  },
};
