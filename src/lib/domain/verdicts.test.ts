import { describe, expect, it } from 'vitest';
import { makeRound } from '$lib/testing/factories';
import { inheritedVerdict, nextRoundVerdicts, verdictCounts } from './verdicts';

describe('verdictCounts', () => {
  it('agrupa veredictos', () => {
    expect(verdictCounts(['approved', 'approved', 'changes_requested', 'pending'])).toEqual({
      approved: 2,
      changes: 1,
      pending: 1,
    });
  });
});

describe('inheritedVerdict', () => {
  const prev = makeRound({ verdicts: { a: 'approved', b: 'changes_requested' } });

  it('devuelve el veredicto previo si existe', () => {
    expect(inheritedVerdict(prev, 'a')).toBe('approved');
  });

  it('devuelve null sin ronda previa o sin veredicto', () => {
    expect(inheritedVerdict(undefined, 'a')).toBeNull();
    expect(inheritedVerdict(prev, 'c')).toBeNull();
  });
});

describe('nextRoundVerdicts', () => {
  const prev = makeRound({ verdicts: { a: 'approved', b: 'changes_requested', c: 'approved' } });

  it('hereda salvo pantallas recapturadas, que vuelven a pending', () => {
    const out = nextRoundVerdicts(prev, ['a', 'b', 'c', 'd'], ['b', 'd']);
    expect(out).toEqual({ a: 'approved', b: 'pending', c: 'approved', d: 'pending' });
  });
});
