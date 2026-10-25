import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import type { ProjectRole } from '$lib/api/types';
import { isStatusFilter } from '$lib/domain/user-filters';
import { invitationSchema, NO_ACCESS } from '$lib/schemas/admin';
import { fieldErrors } from '$lib/schemas/form-errors';
import { orgRoleSchema, userStatusSchema } from '$lib/schemas/roles';
import { apiFail, failStatus, field, toastResult } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requirePermission, unwrap } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  requirePermission(locals, 'users:invite');
  const api = gateway(locals, fetch).directory;

  const [users, invitations, projects] = await Promise.all([
    api.listUsers(),
    api.listInvitations(),
    api.listProjects(),
  ]);
  const projectList = unwrap(projects, url);
  const memberLists = await Promise.all(projectList.map((p) => api.listMembers(p.id)));

  /** Proyectos y rol de cada persona, para la columna «Proyectos». */
  const access: Record<string, Array<{ project: string; role: ProjectRole }>> = {};
  memberLists.forEach((result, i) => {
    const project = projectList[i];
    if (!result.ok || !project) return;
    for (const m of result.data)
      (access[m.userId] ??= []).push({ project: project.name, role: m.role });
  });

  const status = url.searchParams.get('status');
  const filters = {
    q: url.searchParams.get('q')?.trim() ?? '',
    status: isStatusFilter(status) ? status : 'active',
  };
  const all = unwrap(users, url);
  const q = filters.q.toLowerCase();
  const items = all.filter(
    (u) =>
      (filters.status === 'all' || u.status === filters.status) &&
      (!q || u.name.toLowerCase().includes(q) || u.email.includes(q)),
  );

  return {
    meta: {
      title: 'Usuarios',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Usuarios' }],
      tab: 'users',
    },
    users: items,
    counts: {
      active: all.filter((u) => u.status === 'active').length,
      inactive: all.filter((u) => u.status === 'inactive').length,
      all: all.length,
    },
    filters,
    invitations: unwrap(invitations, url).filter((i) => i.status !== 'used'),
    projects: projectList.map((p) => ({ id: p.id, name: p.name })),
    access,
    canManageOwners: locals.permissions.has('org:manage'),
  };
};

export const actions: Actions = {
  invite: async ({ request, locals, fetch }) => {
    requirePermission(locals, 'users:invite');
    const data = await request.formData();
    const api = gateway(locals, fetch).directory;
    const projects = await api.listProjects();
    // Un select por proyecto: vacío = sin acceso. El schema valida cada rol.
    const memberships = (projects.ok ? projects.data : [])
      .map((p) => ({ projectId: p.id, role: field(data, `project:${p.id}`) }))
      .filter((m) => m.role !== '' && m.role !== NO_ACCESS);
    const raw = { email: field(data, 'email'), role: field(data, 'role'), projects: memberships };
    const parsed = invitationSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { inviteErrors: fieldErrors(parsed.error), inviteEmail: raw.email });
    }
    const result = await api.invite(parsed.data);
    if (!result.ok) {
      return fail(failStatus(result.error.status), {
        inviteErrors: { email: result.error.message },
        inviteEmail: raw.email,
      });
    }
    return { invited: result.data.email, message: `Invitación enviada a ${result.data.email}.` };
  },

  revokeInvite: async ({ request, locals, fetch }) => {
    requirePermission(locals, 'users:invite');
    const id = field(await request.formData(), 'id');
    const result = await gateway(locals, fetch).directory.revokeInvitation(id);
    return toastResult(result, 'Invitación revocada.');
  },

  status: async ({ request, locals, fetch }) => {
    requirePermission(locals, 'users:invite');
    const data = await request.formData();
    const status = userStatusSchema.safeParse(field(data, 'status'));
    if (!status.success) return fail(400, { error: 'Estado no válido.' });
    const result = await gateway(locals, fetch).directory.setUserStatus(
      field(data, 'userId'),
      status.data,
    );
    if (!result.ok) return apiFail(result.error);
    return {
      message:
        status.data === 'inactive'
          ? `${result.data.name} quedó desactivado y sus tokens se revocaron.`
          : `${result.data.name} se reactivó.`,
    };
  },

  role: async ({ request, locals, fetch }) => {
    requirePermission(locals, 'users:invite');
    const data = await request.formData();
    const role = orgRoleSchema.safeParse(field(data, 'role'));
    if (!role.success) return fail(400, { error: 'Rol no válido.' });
    const result = await gateway(locals, fetch).directory.setOrgRole(
      field(data, 'userId'),
      role.data,
    );
    if (!result.ok) return apiFail(result.error);
    return { message: `Rol de ${result.data.name} actualizado.` };
  },
};
