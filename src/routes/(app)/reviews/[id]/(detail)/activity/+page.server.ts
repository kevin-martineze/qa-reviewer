import type { PageServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';
import { unwrap } from '$lib/server/guards';
import { reviewMeta } from '$lib/server/review-meta';

export const load: PageServerLoad = async ({ parent, locals, fetch, url, params }) => {
  const { review } = await parent();
  const events = unwrap(await gateway(locals, fetch).reviews.activity(params.id), url);
  return {
    events: [...events].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    meta: reviewMeta(review, 'activity'),
  };
};
