import { describe, expect, it } from 'vitest';
import type { Comment } from '$lib/api/types';
import { awaitingFollowUp } from './follow-ups';

const base: Comment = {
  id: 'c1',
  review: 'QR-0001',
  screen: 'a',
  round: 1,
  author: 'u2',
  when: 'Ayer',
  body: 'x',
  anchor: null,
  el: null,
  resolved: false,
  followUp: null,
  replies: [],
};

describe('awaitingFollowUp', () => {
  it('comentario viejo abierto sin confirmar pide seguimiento', () => {
    expect(awaitingFollowUp({ ...base, round: 1 }, 2)).toBe(true);
  });

  it('no pide seguimiento si está resuelto o el diseño confirmó "still"', () => {
    expect(awaitingFollowUp({ ...base, resolved: true }, 2)).toBe(false);
    expect(awaitingFollowUp({ ...base, followUp: 'still' }, 2)).toBe(false);
  });

  it('no pide seguimiento en la ronda actual', () => {
    expect(awaitingFollowUp({ ...base, round: 2 }, 2)).toBe(false);
  });
});
