import { describe, expect, it } from 'vitest';
import type { PullRequest } from '$lib/api/types';
import { addBusinessDays, awaitingDesign, dueState } from './due';

const now = new Date('2026-10-25T20:00:00Z');
const pr: PullRequest = {
  number: 1,
  url: '',
  base: 'develop',
  head: 'feat',
  state: 'open',
  check: 'pending',
  commit: 'abc',
};

describe('dueState', () => {
  it('vencida, por vencer y a tiempo', () => {
    expect(dueState({ status: 'open', dueAt: '2026-10-24T22:00:00Z', pr }, now)).toMatchObject({
      tone: 'danger',
      overdue: true,
    });
    expect(dueState({ status: 'in_review', dueAt: '2026-10-26T15:00:00Z', pr }, now).tone).toBe(
      'warning',
    );
    expect(dueState({ status: 'open', dueAt: '2026-10-29T22:00:00Z', pr }, now)).toMatchObject({
      tone: 'neutral',
      label: 'En 4 días',
    });
  });

  it('fuera de la cancha de diseño no corre el plazo', () => {
    expect(dueState({ status: 'changes_requested', dueAt: null, pr }, now).label).toBe(
      'Esperando al autor',
    );
    expect(dueState({ status: 'approved', dueAt: null, pr }, now).label).toBe('Aprobada');
    expect(
      dueState({ status: 'closed', dueAt: null, pr: { ...pr, state: 'merged' } }, now).label,
    ).toBe('PR fusionado');
  });
});

describe('awaitingDesign', () => {
  it('solo abierta o en revisión', () => {
    expect(awaitingDesign({ status: 'open' })).toBe(true);
    expect(awaitingDesign({ status: 'in_review' })).toBe(true);
    expect(awaitingDesign({ status: 'changes_requested' })).toBe(false);
  });
});

describe('addBusinessDays', () => {
  it('salta el fin de semana y conserva la hora', () => {
    // Viernes 30 oct 2026, 15:00 UTC + 2 hábiles = martes 3 nov.
    expect(addBusinessDays(new Date('2026-10-30T15:00:00Z'), 2).toISOString()).toBe(
      '2026-11-03T15:00:00.000Z',
    );
  });

  it('desde un sábado cuenta desde el lunes', () => {
    expect(addBusinessDays(new Date('2026-10-31T09:00:00Z'), 1).toISOString()).toBe(
      '2026-11-02T09:00:00.000Z',
    );
  });

  it('cero días no mueve la fecha', () => {
    const from = new Date('2026-10-28T12:00:00Z');
    expect(addBusinessDays(from, 0).getTime()).toBe(from.getTime());
  });
});
