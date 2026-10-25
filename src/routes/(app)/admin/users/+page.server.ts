import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    meta: {
      title: 'Usuarios',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Usuarios' }],
      tab: 'users',
    },
  };
};
