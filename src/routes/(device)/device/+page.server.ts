import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { defaultDeviceLabel, normalizeUserCode } from '$lib/domain/device';
import { permissionsFor } from '$lib/domain/permissions';
import { tokenSchema } from '$lib/schemas/account';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { apiFail } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requirePermission, requireUser, throwApiError, unwrap } from '$lib/server/guards';

const META = {
  title: 'Conectar Claude Code',
  description: 'La skill /design-review pide permiso para publicar revisiones a tu nombre.',
};

const CODE_SHAPE = 'El código tiene 8 letras y números, como ABCD-EFGH.';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  const user = requireUser(locals);
  const raw = url.searchParams.get('code');
  const empty = { meta: META, code: raw ?? '', device: null, projects: [], defaultLabel: '' };
  if (raw === null) return { ...empty, codeError: null };

  const code = normalizeUserCode(raw);
  if (!code) return { ...empty, codeError: CODE_SHAPE };

  const api = gateway(locals, fetch);
  const device = await api.devices.get(code);
  if (!device.ok) {
    // Un código mal copiado o el límite de intentos se corrigen en el mismo formulario.
    if (device.error.status === 404 || device.error.status === 429) {
      return { ...empty, codeError: device.error.message };
    }
    throwApiError(device.error, url);
  }

  const projects = unwrap(await api.directory.listProjects(), url)
    .filter((p) => permissionsFor(user, p.id).has('tokens:own'))
    .map((p) => ({ value: p.id, label: p.name }));

  return {
    meta: META,
    code,
    codeError: null,
    device: device.data,
    projects,
    defaultLabel: defaultDeviceLabel(device.data.client.hostname),
  };
};

function codeFrom(url: URL): string | null {
  return normalizeUserCode(url.searchParams.get('code'));
}

export const actions: Actions = {
  approve: async ({ request, locals, fetch, url }) => {
    const code = codeFrom(url);
    if (!code) return fail(400, { error: CODE_SHAPE });
    const raw = formObject(await request.formData(), ['label', 'projectId']);
    const parsed = tokenSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { errors: fieldErrors(parsed.error), label: raw.label });
    }
    requirePermission(locals, 'tokens:own', parsed.data.projectId);
    const result = await gateway(locals, fetch).devices.approve(
      code,
      parsed.data.projectId,
      parsed.data.label,
    );
    if (!result.ok) return apiFail(result.error);
    return { message: 'Listo. Vuelve a la terminal.' };
  },

  deny: async ({ locals, fetch, url }) => {
    requireUser(locals);
    const code = codeFrom(url);
    if (!code) return fail(400, { error: CODE_SHAPE });
    const result = await gateway(locals, fetch).devices.deny(code);
    if (!result.ok) return apiFail(result.error);
    return { message: 'Acceso rechazado.' };
  },
};
