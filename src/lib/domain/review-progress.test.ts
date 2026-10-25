import { describe, expect, it } from 'vitest';
import { makeScreen } from '$lib/testing/factories';
import { progressOf } from './review-progress';

describe('progressOf', () => {
  it('cuenta aprobadas, ajustes y pendientes', () => {
    const p = progressOf([
      makeScreen({ verdict: 'approved' }),
      makeScreen({ verdict: 'approved' }),
      makeScreen({ verdict: 'changes_requested' }),
      makeScreen({ verdict: 'pending' }),
    ]);
    expect(p).toEqual({ total: 4, approved: 2, changes: 1, done: 3, pending: 1 });
  });
});
