import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fieldErrors } from '$lib/schemas/form-errors';
import { assignmentSchema } from '$lib/schemas/project';
import { field, fields } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { unwrap } from '$lib/server/guards';
import { projectMeta, saveProject } from '$lib/server/project-settings';

export const load: PageServerLoad = async ({ parent, locals, fetch, url, params }) => {
  const { project, people } = await parent();
  const members = unwrap(await gateway(locals, fetch).directory.listMembers(params.slug), url);
  return {
    meta: projectMeta(project, 'assignment'),
    designers: members
      .filter((m) => m.role === 'designer' || m.role === 'design_lead')
      .map((m) => ({ value: m.userId, label: people[m.userId]?.name ?? m.userId })),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const patterns = fields(data, 'pattern');
    const users = fields(data, 'userId');
    const raw = {
      strategy: field(data, 'strategy'),
      moduleRules: patterns.map((pattern, i) => ({ pattern, userId: users[i] ?? '' })),
    };
    const parsed = assignmentSchema.safeParse(raw);
    if (!parsed.success) {
      // Errores por fila: `moduleRules.2.pattern` → { '2.pattern': '…' }.
      const rowErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const [head, row, key] = issue.path;
        if (head === 'moduleRules' && typeof row === 'number' && typeof key === 'string') {
          rowErrors[`${row}.${key}`] ??= issue.message;
        }
      }
      return fail(400, { errors: fieldErrors(parsed.error), rowErrors });
    }
    // Las reglas se conservan aunque la estrategia no sea «por módulo».
    return saveProject(event, parsed.data, 'Asignación actualizada.');
  },
};
