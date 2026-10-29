import { describe, expect, it } from 'vitest';
import type { ProjectMember } from '$lib/api/types';
import { assignableDesigners } from './assignees';
import type { People } from './people';

const person = (active: boolean) => ({ name: 'X', email: 'x@ejemplo.co', active, avatar: null });
const people: People = { u1: person(true), u2: person(true), u3: person(false), u4: person(true) };
const member = (userId: string, role: ProjectMember['role']): ProjectMember => ({
  userId,
  projectId: 'p',
  role,
});

describe('assignableDesigners', () => {
  it('solo diseño activo del proyecto y nunca el autor', () => {
    const members = [
      member('u1', 'designer'),
      member('u2', 'design_lead'),
      member('u3', 'designer'),
      member('u4', 'developer'),
    ];
    expect(assignableDesigners(members, 'u2', people)).toEqual(['u1']);
  });

  it('alguien que no está en el directorio no se ofrece', () => {
    expect(assignableDesigners([member('u9', 'designer')], 'u1', people)).toEqual([]);
  });
});
