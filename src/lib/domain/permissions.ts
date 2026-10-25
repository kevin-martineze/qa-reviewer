import type { OrgRole, ProjectRole, SessionUser } from '$lib/api/types';

export type Permission =
  | 'org:manage'
  | 'users:invite'
  | 'projects:create'
  | 'projects:configure'
  | 'members:manage'
  | 'reviews:read'
  | 'reviews:create'
  | 'reviews:assign'
  | 'verdicts:set'
  | 'reviews:reopen'
  | 'comments:create'
  | 'comments:resolve'
  | 'comments:moderate'
  | 'tokens:own'
  | 'reports:view';

export interface PermissionDef {
  key: Permission;
  label: string;
  roles: Array<OrgRole | ProjectRole>;
}

export const PERMISSIONS: readonly PermissionDef[] = [
  { key: 'org:manage', label: 'Gestionar la organización', roles: ['owner'] },
  { key: 'users:invite', label: 'Invitar y desactivar usuarios', roles: ['owner', 'admin'] },
  { key: 'projects:create', label: 'Crear proyectos', roles: ['owner', 'admin'] },
  {
    key: 'projects:configure',
    label: 'Configurar el proyecto',
    roles: ['owner', 'admin', 'project_admin'],
  },
  {
    key: 'members:manage',
    label: 'Gestionar miembros',
    roles: ['owner', 'admin', 'project_admin'],
  },
  {
    key: 'reviews:read',
    label: 'Ver revisiones',
    roles: ['owner', 'admin', 'project_admin', 'design_lead', 'designer', 'developer', 'viewer'],
  },
  {
    key: 'reviews:create',
    label: 'Crear revisiones y rondas (skill)',
    roles: ['project_admin', 'developer'],
  },
  {
    key: 'reviews:assign',
    label: 'Asignar y reasignar',
    roles: ['owner', 'admin', 'project_admin', 'design_lead'],
  },
  {
    key: 'verdicts:set',
    label: 'Dar veredicto y enviar revisión',
    roles: ['design_lead', 'designer'],
  },
  { key: 'reviews:reopen', label: 'Reabrir un envío', roles: ['project_admin', 'design_lead'] },
  {
    key: 'comments:create',
    label: 'Comentar',
    roles: ['owner', 'admin', 'project_admin', 'design_lead', 'designer', 'developer', 'viewer'],
  },
  {
    key: 'comments:resolve',
    label: 'Resolver comentarios',
    roles: ['project_admin', 'design_lead', 'designer', 'developer'],
  },
  {
    key: 'comments:moderate',
    label: 'Moderar comentarios de otros',
    roles: ['owner', 'admin', 'project_admin', 'design_lead'],
  },
  {
    key: 'tokens:own',
    label: 'Tokens personales de la skill',
    roles: ['project_admin', 'developer'],
  },
  {
    key: 'reports:view',
    label: 'Ver métricas',
    roles: ['owner', 'admin', 'project_admin', 'design_lead'],
  },
];

export function permissionsOf(orgRole: OrgRole, projectRole?: ProjectRole): Set<string> {
  const roles = new Set<string>();
  if (projectRole) roles.add(projectRole);
  if (orgRole === 'owner' || orgRole === 'admin') {
    roles.add(orgRole);
    roles.add('project_admin');
  }
  const set = new Set<string>();
  for (const def of PERMISSIONS) {
    if (def.roles.some((r) => roles.has(r))) set.add(def.key);
  }
  return set;
}

/** Rol efectivo del usuario en un proyecto (owner y admin cuentan como project_admin). */
export function projectRoleOf(user: SessionUser, projectId: string): ProjectRole | undefined {
  return user.memberships.find((m) => m.projectId === projectId)?.role;
}

/** Permisos del usuario dentro de un proyecto concreto. */
export function permissionsFor(user: SessionUser, projectId: string | null): Set<string> {
  return permissionsOf(user.orgRole, projectId ? projectRoleOf(user, projectId) : undefined);
}

/** Proyectos que el usuario puede abrir: todos para owner y admin, si no los suyos. */
export function visibleProjectIds(user: SessionUser, allProjectIds: readonly string[]): string[] {
  if (user.orgRole === 'owner' || user.orgRole === 'admin') return [...allProjectIds];
  const mine = new Set(user.memberships.map((m) => m.projectId));
  return allProjectIds.filter((id) => mine.has(id));
}

export function can(permissions: ReadonlySet<string>, permission: Permission): boolean {
  return permissions.has(permission);
}

export function permissionLabel(key: string): string {
  return PERMISSIONS.find((d) => d.key === key)?.label ?? key;
}

export function permissionGrantedBy(key: string): string {
  const def = PERMISSIONS.find((d) => d.key === key);
  const orgOnly = (def?.roles ?? []).every((r) => r === 'owner' || r === 'admin');
  if (orgOnly) return 'un admin de la organización';
  return 'un admin de la organización o el project_admin del proyecto';
}
