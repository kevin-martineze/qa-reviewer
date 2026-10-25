import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { projectGeneralSchema } from '$lib/schemas/project';
import { projectMeta, saveProject } from '$lib/server/project-settings';

export const load: PageServerLoad = async ({ parent }) => {
  const { project } = await parent();
  return { meta: projectMeta(project, 'general') };
};

export const actions: Actions = {
  default: async (event) => {
    const raw = formObject(await event.request.formData(), ['name']);
    const parsed = projectGeneralSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { errors: fieldErrors(parsed.error) });
    return saveProject(event, parsed.data, 'Proyecto actualizado.');
  },
};
