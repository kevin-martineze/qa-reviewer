import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isPriority } from '$lib/domain/review-query';
import { gateway } from '$lib/server/gateway';
import { requireUser } from '$lib/server/guards';
import { reviewMeta } from '$lib/server/review-meta';

export const load: PageServerLoad = async ({ parent, url }) => {
  const { review } = await parent();
  return {
    changedOnly: url.searchParams.get('changed') === '1',
    meta: reviewMeta(review, 'screens'),
  };
};

// Acciones de la revisión. El layout no puede tener actions, por eso viven aquí;
// el gateway vuelve a validar el permiso en cada una.
export const actions: Actions = {
  assign: async ({ request, params, locals, fetch }) => {
    requireUser(locals);
    const assignees = (await request.formData())
      .getAll('assignees')
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
    const result = await gateway(locals, fetch).reviews.assign(params.id, assignees);
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { ok: true, message: assignees.length ? 'Asignación guardada.' : 'Quedó sin asignar.' };
  },

  priority: async ({ request, params, locals, fetch }) => {
    requireUser(locals);
    const value = (await request.formData()).get('priority');
    const priority = typeof value === 'string' ? value : null;
    if (!isPriority(priority)) return fail(400, { error: 'Prioridad no válida.' });
    const result = await gateway(locals, fetch).reviews.setPriority(params.id, priority);
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { ok: true, message: 'Prioridad actualizada.' };
  },

  submit: async ({ request, params, locals, fetch }) => {
    requireUser(locals);
    const raw = (await request.formData()).get('body');
    const body = typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 2000) : null;
    const result = await gateway(locals, fetch).feedback.submit(params.id, body);
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return {
      ok: true,
      message: result.data.status === 'approved' ? 'Ronda aprobada.' : 'Ajustes enviados al autor.',
    };
  },

  reopen: async ({ request, params, locals, fetch }) => {
    requireUser(locals);
    const raw = (await request.formData()).get('reason');
    const reason = typeof raw === 'string' ? raw.trim() : '';
    if (reason.length < 5) return fail(400, { error: 'Escribe el motivo (mínimo 5 caracteres).' });
    const result = await gateway(locals, fetch).reviews.reopen(params.id, reason);
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { ok: true, message: 'Envío reabierto.' };
  },
};
