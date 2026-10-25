import { describe, expect, it } from 'vitest';
import { can, permissionsOf } from './permissions';

describe('permissionsOf', () => {
  it('owner suma project_admin implícito', () => {
    const perms = permissionsOf('owner', 'designer');
    expect(perms.has('org:manage')).toBe(true);
    expect(perms.has('projects:configure')).toBe(true);
    expect(perms.has('reports:view')).toBe(true);
    expect(perms.has('users:invite')).toBe(true);
  });

  it('admin no gestiona la organización', () => {
    const perms = permissionsOf('admin', 'designer');
    expect(perms.has('org:manage')).toBe(false);
    expect(perms.has('users:invite')).toBe(true);
    expect(perms.has('projects:create')).toBe(true);
  });

  it('designer da veredicto pero no asigna ni ve métricas', () => {
    const perms = permissionsOf('member', 'designer');
    expect(perms.has('verdicts:set')).toBe(true);
    expect(perms.has('comments:create')).toBe(true);
    expect(perms.has('reviews:assign')).toBe(false);
    expect(perms.has('reports:view')).toBe(false);
  });

  it('developer crea revisiones pero no da veredicto', () => {
    const perms = permissionsOf('member', 'developer');
    expect(perms.has('reviews:create')).toBe(true);
    expect(perms.has('comments:resolve')).toBe(true);
    expect(perms.has('verdicts:set')).toBe(false);
  });

  it('viewer solo lee y comenta', () => {
    const perms = permissionsOf('member', 'viewer');
    expect(perms.has('reviews:read')).toBe(true);
    expect(perms.has('comments:create')).toBe(true);
    expect(perms.has('verdicts:set')).toBe(false);
    expect(perms.has('comments:resolve')).toBe(false);
  });
});

describe('can', () => {
  it('comprueba membresía en el conjunto', () => {
    const perms = permissionsOf('member', 'designer');
    expect(can(perms, 'verdicts:set')).toBe(true);
    expect(can(perms, 'reports:view')).toBe(false);
  });
});
