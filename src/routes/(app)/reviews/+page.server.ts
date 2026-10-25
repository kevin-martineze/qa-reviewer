import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    meta: {
      title: 'Revisiones',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Revisiones' }],
    },
  };
};
