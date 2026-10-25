import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals }) => {
  requirePermission(locals, 'reports:view');
  return {
    meta: {
      title: 'Métricas',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Métricas' }],
    },
  };
};
