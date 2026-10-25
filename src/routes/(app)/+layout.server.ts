import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Project } from '$lib/api/types';
import { requireUser } from '$lib/server/guards';
import { gateway, REVIEWS_SOURCE } from '$lib/server/gateway';

export const load: LayoutServerLoad = async ({ locals, cookies, depends }) => {
  const user = requireUser(locals);
  depends('app:session', 'notifications');

  const g = gateway(locals);

  const projectsResult = await g.directory.listProjects();
  if (!projectsResult.ok) {
    throw error(projectsResult.error.status ?? 500, projectsResult.error.message);
  }

  let projects = projectsResult.data;
  if (user.orgRole !== 'owner' && user.orgRole !== 'admin') {
    const visible: Project[] = [];
    for (const project of projects) {
      const members = await g.directory.listMembers(project.id);
      if (members.ok && members.data.some((m) => m.userId === user.id)) visible.push(project);
    }
    projects = visible;
  }

  const notificationsResult = await g.notifications.list();
  if (!notificationsResult.ok) {
    throw error(notificationsResult.error.status ?? 500, notificationsResult.error.message);
  }
  const notifications = notificationsResult.data;
  const unread = notifications.filter((n) => n.unread).length;

  const isMock = REVIEWS_SOURCE !== 'http';

  let mockUsers: Array<{ id: string; name: string }> = [];
  if (isMock) {
    const usersResult = await g.directory.listUsers();
    if (usersResult.ok) {
      mockUsers = usersResult.data
        .filter((u) => u.status === 'active')
        .map((u) => ({ id: u.id, name: u.name }));
    }
  }

  return {
    user,
    permissions: [...locals.permissions],
    projects,
    notifications,
    unread,
    isMock,
    mockUsers,
    collapsed: cookies.get('sidebar_collapsed') === '1',
  };
};
