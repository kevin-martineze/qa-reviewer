import { ORG_ROLE, PROJECT_ROLE } from '$lib/domain/labels';
import { permissionsOf } from '$lib/domain/permissions';
import { ORG_ROLES, PROJECT_ROLES } from '$lib/schemas/roles';

export interface RoleColumn {
  key: string;
  label: string;
  description: string;
  /** Permisos efectivos, con la misma función que usa la app para autorizar. */
  grants: Set<string>;
}

/** Roles de organización sin rol de proyecto (owner y admin heredan project_admin). */
export function orgRoleColumns(): RoleColumn[] {
  return ORG_ROLES.map((role) => ({
    key: role,
    label: ORG_ROLE[role].label,
    description: ORG_ROLE[role].description,
    grants: permissionsOf(role),
  }));
}

/** Roles de proyecto para un miembro común de la organización. */
export function projectRoleColumns(): RoleColumn[] {
  return PROJECT_ROLES.map((role) => ({
    key: role,
    label: PROJECT_ROLE[role].label,
    description: PROJECT_ROLE[role].description,
    grants: permissionsOf('member', role),
  }));
}
