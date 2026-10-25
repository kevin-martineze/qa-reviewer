import { describe, expect, it } from 'vitest';
import {
  dayGroupLabel,
  dayKey,
  formatDateTime,
  formatDay,
  formatRelative,
  formatShortDate,
  formatTime,
} from './dates';

// 25 oct 2026, 3:00 p. m. en Bogotá (UTC-5).
const now = new Date('2026-10-25T20:00:00Z');

describe('formatRelative', () => {
  it('minutos y horas del mismo día', () => {
    expect(formatRelative('2026-10-25T19:59:40Z', now)).toBe('Ahora');
    expect(formatRelative('2026-10-25T19:55:00Z', now)).toBe('Hace 5 min');
    expect(formatRelative('2026-10-25T18:00:00Z', now)).toBe('Hace 2 h');
  });

  it('ayer con hora, días y fecha corta', () => {
    expect(formatRelative('2026-10-24T21:58:00Z', now)).toMatch(/^Ayer, 4:58/);
    expect(formatRelative('2026-10-22T15:00:00Z', now)).toBe('Hace 3 días');
    expect(formatRelative('2026-10-01T15:00:00Z', now)).toMatch(/^1 oct$/);
  });

  it('usa el día de Bogotá, no el de UTC', () => {
    // 26 oct 01:00 UTC = 25 oct 8:00 p. m. en Bogotá: sigue siendo hoy.
    expect(formatRelative('2026-10-25T14:00:00Z', new Date('2026-10-26T01:00:00Z'))).toBe(
      'Hace 11 h',
    );
  });
});

describe('formatDay', () => {
  it('hoy, mañana y en N días', () => {
    expect(formatDay('2026-10-25T22:00:00Z', now)).toMatch(/^Hoy, 5:00/);
    expect(formatDay('2026-10-26T22:00:00Z', now)).toMatch(/^Mañana, 5:00/);
    expect(formatDay('2026-10-28T22:00:00Z', now)).toBe('En 3 días');
    expect(formatDay('2026-10-23T22:00:00Z', now)).toBe('Hace 2 días');
  });
});

describe('dayGroupLabel', () => {
  it('agrupa por hoy, ayer y fecha', () => {
    expect(dayGroupLabel('2026-10-25T13:00:00Z', now)).toBe('Hoy');
    expect(dayGroupLabel('2026-10-24T13:00:00Z', now)).toBe('Ayer');
    expect(dayGroupLabel('2026-10-20T13:00:00Z', now)).toMatch(/^20 oct$/);
  });
});

describe('formato fijo (igual en Node y en el navegador)', () => {
  it('hora en 12 h con a. m. / p. m.', () => {
    expect(formatTime('2026-10-25T21:58:00Z')).toBe('4:58 p. m.');
    expect(formatTime('2026-10-25T05:07:00Z')).toBe('12:07 a. m.');
    expect(formatTime('2026-10-25T17:00:00Z')).toBe('12:00 p. m.');
  });

  it('fecha y hora completa', () => {
    expect(formatDateTime('2026-09-03T14:30:00Z')).toBe('3 sept 2026, 9:30 a. m.');
  });

  it('fecha corta con año solo si es otro año', () => {
    expect(formatShortDate('2026-01-15T15:00:00Z', now)).toBe('15 ene');
    expect(formatShortDate('2025-12-31T15:00:00Z', now)).toBe('31 dic 2025');
  });

  it('dayKey usa el día de Bogotá', () => {
    expect(dayKey(new Date('2026-10-26T03:00:00Z'))).toBe('2026-10-25');
  });
});
