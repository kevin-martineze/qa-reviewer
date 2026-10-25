import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { toastResult } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requireUser, unwrap } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  requireUser(locals);
  const prefs = unwrap(await gateway(locals, fetch).notifications.prefs(), url);
  return {
    meta: {
      title: 'Notificaciones',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Notificaciones' }],
      tab: 'notifications',
    },
    prefs,
  };
};

export const actions: Actions = {
  default: async ({ request, locals, fetch }) => {
    requireUser(locals);
    // Cada switch viaja solo si está activo.
    const data = await request.formData();
    const result = await gateway(locals, fetch).notifications.updatePrefs({
      review_assigned: data.has('review_assigned'),
      round_uploaded: data.has('round_uploaded'),
      review_submitted: data.has('review_submitted'),
      mention: data.has('mention'),
      reply: data.has('reply'),
      due_soon: data.has('due_soon'),
      overdue: data.has('overdue'),
    });
    return toastResult(result, 'Preferencias guardadas.');
  },
};
