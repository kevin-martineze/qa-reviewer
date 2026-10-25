import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { review } = await parent();
  return {
    meta: {
      title: review.title,
      crumbs: [{ label: 'Revisiones', href: resolve('/reviews') }, { label: review.id }],
      tab: 'rounds',
    },
  };
};
