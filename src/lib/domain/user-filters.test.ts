import { describe, expect, it } from 'vitest';

import { isStatusFilter, usersQueryHref } from './user-filters';

describe('user filters', () => {
  it('valida el estado', () => {
    expect(isStatusFilter('inactive')).toBe(true);
    expect(isStatusFilter('x')).toBe(false);
  });
  it('arma la URL conservando la búsqueda', () => {
    expect(usersQueryHref({ q: 'ana', status: 'active' }, 'all')).toBe('?status=all&q=ana');
    expect(usersQueryHref({ q: '', status: 'all' }, 'active')).toBe('');
  });
});
