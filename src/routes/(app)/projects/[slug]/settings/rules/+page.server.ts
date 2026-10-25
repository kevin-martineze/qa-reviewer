import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fieldErrors } from '$lib/schemas/form-errors';
import { lines, rulesSchema } from '$lib/schemas/project';
import { field } from '$lib/server/action-result';
import { projectMeta, saveProject } from '$lib/server/project-settings';

export const load: PageServerLoad = async ({ parent }) => {
  const { project } = await parent();
  return { meta: projectMeta(project, 'rules') };
};

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const raw = {
      designRules: field(data, 'designRules'),
      maskSelectors: field(data, 'maskSelectors'),
    };
    const parsed = rulesSchema.safeParse({
      designRules: lines(raw.designRules),
      maskSelectors: lines(raw.maskSelectors),
    });
    if (!parsed.success) return fail(400, { errors: fieldErrors(parsed.error), ...raw });
    return saveProject(event, parsed.data, 'Reglas actualizadas.');
  },
};
