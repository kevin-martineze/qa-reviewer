import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';
import { requireUser } from '$lib/server/guards';

export const load: LayoutServerLoad = async ({ locals, params, depends }) => {
  const user = requireUser(locals);
  depends(`review:${params.id}`);

  const result = await gateway(locals).reviews.get(params.id);
  if (!result.ok) {
    throw error(result.error.status ?? 500, {
      message: result.error.message,
      code: 'not_found',
    });
  }

  return {
    review: result.data,
    can: {
      submit: locals.permissions.has('verdicts:set') && result.data.author !== user.id,
    },
  };
};
