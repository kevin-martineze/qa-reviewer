import { describe, expect, it } from 'vitest';
import { groupByDay } from './group-by-day';

const now = new Date('2026-10-25T20:00:00Z');

describe('groupByDay', () => {
  it('agrupa en orden y etiqueta Hoy / Ayer / fecha', () => {
    const groups = groupByDay(
      [
        { id: 1, createdAt: '2026-10-25T18:00:00Z' },
        { id: 2, createdAt: '2026-10-25T14:00:00Z' },
        { id: 3, createdAt: '2026-10-24T22:00:00Z' },
        { id: 4, createdAt: '2026-10-18T15:00:00Z' },
      ],
      now,
    );
    expect(groups.map((g) => [g.label, g.items.map((i) => i.id)])).toEqual([
      ['Hoy', [1, 2]],
      ['Ayer', [3]],
      ['18 oct', [4]],
    ]);
  });

  it('usa el día de Bogotá: las 11 p. m. del 24 no son «hoy»', () => {
    const [group] = groupByDay([{ createdAt: '2026-10-25T04:00:00Z' }], now);
    expect(group?.label).toBe('Ayer');
  });
});
