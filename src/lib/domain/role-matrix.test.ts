import { describe, expect, it } from 'vitest';

import { orgRoleColumns, projectRoleColumns } from './role-matrix';

describe('role matrix', () => {
  it('owner y admin heredan los permisos de admin del proyecto', () => {
    const [owner, admin, member] = orgRoleColumns();
    expect(owner?.grants.has('org:manage')).toBe(true);
    expect(admin?.grants.has('org:manage')).toBe(false);
    expect(admin?.grants.has('members:manage')).toBe(true);
    expect(member?.grants.size).toBe(0);
  });

  it('solo diseño da veredicto', () => {
    const verdict = projectRoleColumns()
      .filter((c) => c.grants.has('verdicts:set'))
      .map((c) => c.key);
    expect(verdict).toEqual(['design_lead', 'designer']);
  });
});
