import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { newProjectSchema } from '$lib/schemas/project';
import { failStatus } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requirePermission, unwrap } from '$lib/server/guards';

const FIELDS = ['name', 'id', 'repo', 'planeKey'] as const;

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  requirePermission(locals, 'projects:create');
  const api = gateway(locals, fetch).directory;
  const projects = unwrap(await api.listProjects(), url);
  const members = await Promise.all(projects.map((p) => api.listMembers(p.id)));

  return {
    meta: {
      title: 'Proyectos',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Proyectos' }],
      tab: 'projects',
    },
    projects: projects.map((p, i) => {
      const list = members[i];
      return { ...p, members: list?.ok ? list.data.length : 0 };
    }),
  };
};

export const actions: Actions = {
  create: async ({ request, locals, fetch }) => {
    requirePermission(locals, 'projects:create');
    const raw = formObject(await request.formData(), FIELDS);
    const parsed = newProjectSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { projectErrors: fieldErrors(parsed.error), projectValues: raw });
    }
    const result = await gateway(locals, fetch).directory.createProject(parsed.data);
    if (!result.ok) {
      // El identificador repetido es el único error que se corrige en el formulario.
      const key = result.error.messageKey === 'projects.exists' ? 'id' : 'name';
      return fail(failStatus(result.error.status), {
        projectErrors: { [key]: result.error.message },
        projectValues: raw,
      });
    }
    return { created: result.data.id, message: `Proyecto ${result.data.name} creado.` };
  },
};
