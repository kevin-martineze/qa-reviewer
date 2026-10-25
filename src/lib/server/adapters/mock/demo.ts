// Cuentas que la pantalla de login muestra en modo mock para entrar con un clic.
import { ORG_ROLE, PROJECT_ROLE } from '$lib/domain/labels';

import { DEMO_PASSWORD, MEMBERSHIPS, PROJECTS, USERS } from './seeds';

export interface DemoAccount {
  name: string;
  email: string;
  role: string;
}

const SHOWN = ['u2', 'u1', 'u3', 'u6', 'u7'];

export function demoAccounts(): { password: string; accounts: DemoAccount[] } {
  const accounts = SHOWN.flatMap((id) => {
    const user = USERS.find((u) => u.id === id);
    if (!user) return [];
    const projects = MEMBERSHIPS.filter((m) => m.userId === id).map((m) => {
      const project = PROJECTS.find((p) => p.id === m.projectId)?.name ?? m.projectId;
      return `${PROJECT_ROLE[m.role].label} en ${project}`;
    });
    const role = user.orgRole === 'member' ? projects.join(' · ') : ORG_ROLE[user.orgRole].label;
    return [{ name: user.name, email: user.email, role }];
  });
  return { password: DEMO_PASSWORD, accounts };
}
