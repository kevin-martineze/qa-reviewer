import { z } from 'zod';

export const ORG_ROLES = ['owner', 'admin', 'member'] as const;
export const PROJECT_ROLES = [
  'project_admin',
  'design_lead',
  'designer',
  'developer',
  'viewer',
] as const;

export const orgRoleSchema = z.enum(ORG_ROLES, 'Elige un rol.');
export const projectRoleSchema = z.enum(PROJECT_ROLES, 'Elige un rol.');
export const userStatusSchema = z.enum(['active', 'inactive']);
