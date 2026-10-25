import { error } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  const { review } = await parent();
  const screen = review.screens.find((s) => s.key === params.key);
  if (!screen) {
    throw error(404, { message: 'Pantalla no encontrada.', code: 'not_found' });
  }
  return {
    meta: {
      title: screen.title,
      crumbs: [
        { label: 'Revisiones', href: resolve('/reviews') },
        { label: review.id, href: resolve('/(app)/reviews/[id]/(detail)', { id: review.id }) },
        { label: screen.key },
      ],
    },
    screen,
  };
};
