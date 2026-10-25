import { describe, expect, it } from 'vitest';

import { barPath, columnPath, formatHours, formatPercent, niceTicks } from './chart';

describe('niceTicks', () => {
  it('cubre el máximo con pasos limpios', () => {
    expect(niceTicks(7)).toEqual([0, 2, 4, 6, 8]);
    expect(niceTicks(10)).toEqual([0, 5, 10]);
    expect(niceTicks(0)).toEqual([0, 1]);
  });
});

describe('paths', () => {
  it('no dibuja marcas vacías', () => {
    expect(columnPath(0, 0, 10, 0)).toBe('');
    expect(barPath(0, 0, 0, 10)).toBe('');
  });
  it('la columna arranca en la base', () => {
    expect(columnPath(2, 10, 20, 30).startsWith('M2,40')).toBe(true);
  });
});

describe('formatos', () => {
  it('porcentaje y horas', () => {
    expect(formatPercent(0.625)).toBe('63 %');
    expect(formatHours(18.4)).toBe('18 h');
    expect(formatHours(60)).toBe('2,5 d');
  });
});
