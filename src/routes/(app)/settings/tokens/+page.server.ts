import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    meta: {
      title: 'Tokens',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Tokens' }],
      tab: 'tokens',
    },
  };
};
