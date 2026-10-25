import { describe, expect, it } from 'vitest';
import type { Screen } from '$lib/api/types';
import { progressOf } from './review-progress';

const screen = (verdict: Screen['verdict']): Screen =>
  ({
    key: verdict,
    title: verdict,
    lead: '',
    vp: '1280 × 720',
    route: '/x',
    img: null,
    before: null,
    elements: [],
    changes: [],
    questions: [],
    verdict,
  }) satisfies Screen;

describe('progressOf', () => {
  it('cuenta aprobadas, ajustes y pendientes', () => {
    const p = progressOf([
      screen('approved'),
      screen('approved'),
      screen('changes_requested'),
      screen('pending'),
    ]);
    expect(p).toEqual({ total: 4, approved: 2, changes: 1, done: 3, pending: 1 });
  });
});
