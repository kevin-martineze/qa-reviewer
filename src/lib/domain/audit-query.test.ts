import { describe, expect, it } from 'vitest';

import { auditQueryHref, parseAuditQuery } from './audit-query';

describe('audit query', () => {
  it('ignora tipos y páginas no válidos', () => {
    expect(parseAuditQuery(new URLSearchParams('type=nope&page=-2'))).toEqual({
      type: '',
      actor: '',
      page: 1,
    });
  });

  it('un filtro nuevo vuelve a la página 1', () => {
    const current = parseAuditQuery(new URLSearchParams('type=role_changed&page=3'));
    expect(auditQueryHref(current, { actor: 'u2' })).toBe('?type=role_changed&actor=u2');
    expect(auditQueryHref(current, { page: 4 })).toBe('?type=role_changed&page=4');
  });
});
