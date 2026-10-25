import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    meta: {
      title: 'Auditoría',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Auditoría' }],
      tab: 'audit',
    },
  };
};
