import { describe, expect, it } from 'vitest';
import type { SessionUser } from '$lib/api/types';
import { reviewAbilities } from './review-abilities';

const user = (id: string, role: SessionUser['memberships'][number]['role']): SessionUser => ({
  id,
  name: id,
  email: `${id}@x.co`,
  orgRole: 'member',
  status: 'active',
  avatar: null,
  memberships: [{ projectId: 'p', role }],
});

const review = { project: 'p', author: 'dev', status: 'in_review' as const };

describe('reviewAbilities', () => {
  it('el diseñador da veredicto y comenta, pero no asigna', () => {
    expect(reviewAbilities(user('d', 'designer'), review)).toMatchObject({
      verdict: true,
      comment: true,
      assign: false,
      reopen: false,
    });
  });

  it('el autor nunca da veredicto a lo suyo', () => {
    expect(reviewAbilities(user('dev', 'developer'), review).verdict).toBe(false);
    expect(reviewAbilities(user('dev', 'developer'), review).isAuthor).toBe(true);
  });

  it('con la ronda enviada ya no hay veredicto; el líder puede reabrir', () => {
    const sent = { ...review, status: 'changes_requested' as const };
    expect(reviewAbilities(user('l', 'design_lead'), sent)).toMatchObject({
      verdict: false,
      reopen: true,
      assign: true,
    });
  });

  it('la lectora comenta pero no decide', () => {
    expect(reviewAbilities(user('v', 'viewer'), review)).toMatchObject({
      verdict: false,
      comment: true,
      assign: false,
      reopen: false,
    });
  });

  it('sin membresía en el proyecto no puede nada', () => {
    const other = { ...user('d', 'designer'), memberships: [] };
    expect(reviewAbilities(other, review).verdict).toBe(false);
  });
});
