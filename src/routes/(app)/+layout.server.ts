import type { LayoutServerLoad } from './$types';
import { gateway, isMock } from '$lib/server/gateway';
import { requireUser, unwrap } from '$lib/server/guards';
import { SIDEBAR_COOKIE } from '$lib/server/session';

export interface Person {
  name: string;
  email: string;
  active: boolean;
}

export const load: LayoutServerLoad = async ({ locals, cookies, depends, fetch, url }) => {
  const user = requireUser(locals);
  depends('app:session', 'app:notifications');

  const g = gateway(locals, fetch);
  const [projectsResult, usersResult, unreadResult, recentResult, inboxResult] = await Promise.all([
    g.directory.listProjects(),
    g.directory.listUsers(),
    g.notifications.unreadCount(),
    g.notifications.list({}),
    g.reviews.list({
      assignee: user.id,
      project: locals.projectId ?? undefined,
      status: ['open', 'in_review'],
      limit: 1,
    }),
  ]);

  const projects = unwrap(projectsResult, url);
  const users = unwrap(usersResult, url);
  const people: Record<string, Person> = {};
  for (const u of users)
    people[u.id] = { name: u.name, email: u.email, active: u.status === 'active' };

  return {
    /** Referencia de «ahora» para fechas relativas: la misma en el server y en el navegador. */
    now: new Date().toISOString(),
    user,
    permissions: [...locals.permissions],
    projects,
    projectId: locals.projectId ?? projects[0]?.id ?? null,
    people,
    unread: unreadResult.ok ? unreadResult.data : 0,
    inboxCount: inboxResult.ok ? inboxResult.data.pagination.total : 0,
    recentNotifications: recentResult.ok ? recentResult.data.slice(0, 5) : [],
    isMock,
    mockUsers: isMock
      ? users.filter((u) => u.status === 'active').map((u) => ({ id: u.id, name: u.name }))
      : [],
    sidebarCollapsed: cookies.get(SIDEBAR_COOKIE) === '1',
  };
};
