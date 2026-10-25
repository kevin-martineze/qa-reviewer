// Acciones de la sesión que usa el shell (SvelteKit no tiene actions en layouts).
// No hay página: el load redirige al inicio.
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { visibleProjectIds } from '$lib/domain/permissions';
import { safeRedirectTo } from '$lib/domain/security';
import { mockToken } from '$lib/server/adapters/mock';
import { gateway, isMock } from '$lib/server/gateway';
import { requireUser } from '$lib/server/guards';
import {
  afterProjectSwitch,
  clearSession,
  PROJECT_COOKIE,
  setProject,
  setSession,
} from '$lib/server/session';

export const load: PageServerLoad = () => {
  throw redirect(303, '/');
};

function back(data: FormData): string {
  const target = data.get('redirectTo');
  return safeRedirectTo(typeof target === 'string' ? target : null) ?? '/';
}

export const actions: Actions = {
  logout: async ({ cookies, locals, fetch }) => {
    await gateway(locals, fetch).auth.logout();
    clearSession(cookies);
    throw redirect(303, '/login?reason=logout');
  },

  project: async ({ request, cookies, locals, fetch }) => {
    const user = requireUser(locals);
    const data = await request.formData();
    const projectId = String(data.get('projectId') ?? '');
    const projects = await gateway(locals, fetch).directory.listProjects();
    const ids = projects.ok ? projects.data.map((p) => p.id) : [];
    if (!visibleProjectIds(user, ids).includes(projectId)) {
      return fail(400, { error: 'Proyecto no válido.' });
    }
    setProject(cookies, projectId);
    throw redirect(303, afterProjectSwitch(back(data), projectId));
  },

  switchUser: async ({ request, cookies, locals, fetch }) => {
    if (!isMock) throw error(404, { message: 'No encontramos esta página.', code: 'not_found' });
    requireUser(locals);
    const data = await request.formData();
    const userId = String(data.get('userId') ?? '');
    const users = await gateway(locals, fetch).directory.listUsers();
    const target = users.ok
      ? users.data.find((u) => u.id === userId && u.status === 'active')
      : undefined;
    if (!target) return fail(400, { error: 'Usuario no válido.' });
    setSession(cookies, mockToken(target.id));
    cookies.delete(PROJECT_COOKIE, { path: '/' });
    throw redirect(303, back(data));
  },
};
