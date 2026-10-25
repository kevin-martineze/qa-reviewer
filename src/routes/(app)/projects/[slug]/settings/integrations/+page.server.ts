import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fieldErrors } from '$lib/schemas/form-errors';
import { integrationsSchema } from '$lib/schemas/project';
import { field } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requirePermission, unwrap } from '$lib/server/guards';
import { projectMeta, saveProject } from '$lib/server/project-settings';

export const load: PageServerLoad = async ({ parent }) => {
  const { project } = await parent();
  return { meta: projectMeta(project, 'integrations') };
};

export const actions: Actions = {
  default: async (event) => {
    requirePermission(event.locals, 'projects:configure', event.params.slug);
    const data = await event.request.formData();
    const parsed = integrationsSchema.safeParse({
      checkName: field(data, 'checkName'),
      commentOnPr: data.has('commentOnPr'),
      commentOnCard: data.has('commentOnCard'),
    });
    if (!parsed.success) return fail(400, { errors: fieldErrors(parsed.error) });

    // Se parte de lo guardado: la conexión y el repo no se editan desde aquí.
    const project = unwrap(
      await gateway(event.locals, event.fetch).directory.getProject(event.params.slug),
    );
    const { github, plane } = project.integrations;
    return saveProject(
      event,
      {
        integrations: {
          github: {
            ...github,
            checkName: parsed.data.checkName,
            commentOnPr: parsed.data.commentOnPr,
          },
          plane: { ...plane, commentOnCard: parsed.data.commentOnCard },
        },
      },
      'Integraciones actualizadas.',
    );
  },
};
