import type { LayoutServerLoad } from './$types';
import { requirePermission } from '$lib/server/guards';

export const load: LayoutServerLoad = async ({ locals }) => {
  requirePermission(locals, 'users:invite');
  return {};
};
