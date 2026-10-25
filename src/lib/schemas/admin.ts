import { z } from 'zod';

import { emailSchema } from './auth';
import { orgRoleSchema, projectRoleSchema } from './roles';

/** Valor del select de proyecto cuando la persona no entra a ese proyecto. */
export const NO_ACCESS = 'none';

export const invitationSchema = z.object({
  email: emailSchema,
  role: orgRoleSchema,
  projects: z.array(z.object({ projectId: z.string().min(1), role: projectRoleSchema })),
});

export const memberSchema = z.object({
  userId: z.string().min(1, 'Elige una persona.'),
  role: projectRoleSchema,
});
