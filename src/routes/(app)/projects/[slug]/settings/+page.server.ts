import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { project } = await parent();
  return {
    meta: {
      title: project.name,
      crumbs: [{ label: project.name }],
      tab: 'general',
    },
  };
};
