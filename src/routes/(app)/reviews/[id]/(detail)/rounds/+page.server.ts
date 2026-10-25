import type { PageServerLoad } from './$types';
import { reviewMeta } from '$lib/server/review-meta';

export const load: PageServerLoad = async ({ parent }) => {
  const { review } = await parent();
  return { meta: reviewMeta(review, 'rounds') };
};
