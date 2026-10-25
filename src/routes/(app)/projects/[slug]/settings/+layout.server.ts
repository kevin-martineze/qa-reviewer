import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';
import { requirePermission } from '$lib/server/guards';

export const load: LayoutServerLoad = async ({ locals, params }) => {
  requirePermission(locals, 'projects:configure');

  const result = await gateway(locals).directory.listProjects();
  const project = result.ok ? result.data.find((p) => p.id === params.slug) : undefined;
  if (!project) throw error(404, { message: 'Proyecto no encontrado.', code: 'not_found' });

  return { project };
};
