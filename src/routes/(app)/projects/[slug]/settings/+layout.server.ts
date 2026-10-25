import type { LayoutServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';
import { requirePermission, unwrap } from '$lib/server/guards';

export const load: LayoutServerLoad = async ({ locals, params, fetch, url }) => {
  requirePermission(locals, 'projects:configure', params.slug);
  const project = unwrap(await gateway(locals, fetch).directory.getProject(params.slug), url);
  return { project };
};
