import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { permissionsFor } from '$lib/domain/permissions';
import { memberSchema } from '$lib/schemas/admin';
import { fieldErrors, formObject } from '$lib/schemas/form-errors';
import { projectRoleSchema } from '$lib/schemas/roles';
import { apiFail, field, toastResult } from '$lib/server/action-result';
import { gateway } from '$lib/server/gateway';
import { requirePermission, requireUser, unwrap } from '$lib/server/guards';
import { projectMeta } from '$lib/server/project-settings';

export const load: PageServerLoad = async ({ parent, locals, fetch, url, params }) => {
  const { project } = await parent();
  const api = gateway(locals, fetch).directory;
  const [members, users] = await Promise.all([api.listMembers(params.slug), api.listUsers()]);
  const all = unwrap(users, url);
  const memberList = unwrap(members, url);
  const byId = new Map(all.map((u) => [u.id, u]));

  const rows = memberList.flatMap((m) => {
    const user = byId.get(m.userId);
    return user ? [{ user, role: m.role }] : [];
  });
  const inProject = new Set(memberList.map((m) => m.userId));

  return {
    meta: projectMeta(project, 'members'),
    members: rows.sort((a, b) => a.user.name.localeCompare(b.user.name, 'es')),
    candidates: all
      .filter((u) => u.status === 'active' && !inProject.has(u.id))
      .map((u) => ({ id: u.id, name: u.name, email: u.email })),
    canManage: permissionsFor(requireUser(locals), params.slug).has('members:manage'),
  };
};

export const actions: Actions = {
  add: async ({ request, locals, fetch, params }) => {
    requirePermission(locals, 'members:manage', params.slug);
    const raw = formObject(await request.formData(), ['userId', 'role']);
    const parsed = memberSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { addErrors: fieldErrors(parsed.error) });
    const result = await gateway(locals, fetch).directory.addMember(
      params.slug,
      parsed.data.userId,
      parsed.data.role,
    );
    return toastResult(result, 'Miembro agregado.');
  },

  role: async ({ request, locals, fetch, params }) => {
    requirePermission(locals, 'members:manage', params.slug);
    const data = await request.formData();
    const role = projectRoleSchema.safeParse(field(data, 'role'));
    if (!role.success) return fail(400, { error: 'Rol no válido.' });
    const result = await gateway(locals, fetch).directory.setMemberRole(
      params.slug,
      field(data, 'userId'),
      role.data,
    );
    return toastResult(result, 'Rol actualizado.');
  },

  remove: async ({ request, locals, fetch, params }) => {
    requirePermission(locals, 'members:manage', params.slug);
    const userId = field(await request.formData(), 'userId');
    const result = await gateway(locals, fetch).directory.removeMember(params.slug, userId);
    if (!result.ok) return apiFail(result.error);
    return { message: 'Miembro quitado del proyecto.' };
  },
};
