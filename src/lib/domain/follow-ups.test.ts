import { describe, expect, it } from 'vitest';
import { makeComment } from '$lib/testing/factories';
import { awaitingFollowUp } from './follow-ups';

describe('awaitingFollowUp', () => {
  it('comentario viejo abierto sin confirmar pide seguimiento', () => {
    expect(awaitingFollowUp(makeComment({ round: 1 }), 2)).toBe(true);
  });

  it('no pide seguimiento si está resuelto o el diseño confirmó "still"', () => {
    expect(awaitingFollowUp(makeComment({ resolved: true }), 2)).toBe(false);
    expect(awaitingFollowUp(makeComment({ followUp: 'still' }), 2)).toBe(false);
  });

  it('no pide seguimiento en la ronda actual', () => {
    expect(awaitingFollowUp(makeComment({ round: 2 }), 2)).toBe(false);
  });
});
