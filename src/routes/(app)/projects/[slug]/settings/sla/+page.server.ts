import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { SLA_MAX, SLA_MIN, slaSchema } from '$lib/schemas/project';
import { projectMeta, saveProject } from '$lib/server/project-settings';

export const load: PageServerLoad = async ({ parent }) => {
  const { project } = await parent();
  return { meta: projectMeta(project, 'sla'), limits: { min: SLA_MIN, max: SLA_MAX } };
};

export const actions: Actions = {
  default: async (event) => {
    const raw = formObject(await event.request.formData(), ['slaDays']);
    const parsed = slaSchema.safeParse(raw);
    if (!parsed.success)
      return fail(400, { errors: fieldErrors(parsed.error), slaDays: raw.slaDays });
    return saveProject(event, parsed.data, 'SLA actualizado.');
  },
};
