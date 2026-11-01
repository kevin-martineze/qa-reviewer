import type { ProjectMember } from '$lib/api/types';
import type { People } from './people';

/**
 * Quién puede quedar asignado a una revisión: diseño del proyecto (`designer` o
 * `design_lead`) con la cuenta activa, sin el autor. El API aplica la misma regla.
 */
export function assignableDesigners(
  members: ProjectMember[],
  author: string,
  people: People,
): string[] {
  return members
    .filter(
      (m) =>
        (m.role === 'designer' || m.role === 'design_lead') &&
        m.userId !== author &&
        people[m.userId]?.active === true,
    )
    .map((m) => m.userId);
}
