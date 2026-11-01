import { describe, expect, it } from 'vitest';

import { defaultDeviceLabel, normalizeUserCode } from './device';

describe('normalizeUserCode', () => {
  it('acepta minúsculas, espacios y el guion opcional', () => {
    expect(normalizeUserCode('wxyz-2345')).toBe('WXYZ-2345');
    expect(normalizeUserCode('WXYZ2345')).toBe('WXYZ-2345');
    expect(normalizeUserCode(' wxyz 2345 ')).toBe('WXYZ-2345');
  });

  it('rechaza largo incorrecto y letras ambiguas', () => {
    expect(normalizeUserCode('')).toBeNull();
    expect(normalizeUserCode(null)).toBeNull();
    expect(normalizeUserCode('WXYZ-234')).toBeNull();
    expect(normalizeUserCode('WXYZ-23450')).toBeNull();
    expect(normalizeUserCode('WXYZ-O1I0')).toBeNull();
    expect(normalizeUserCode('WXYZ/2345')).toBeNull();
  });
});

describe('defaultDeviceLabel', () => {
  it('nombra el equipo y respeta el máximo del token', () => {
    expect(defaultDeviceLabel('mbp-kevin')).toBe('Claude Code · mbp-kevin');
    expect(defaultDeviceLabel('  ')).toBe('Claude Code');
    expect(defaultDeviceLabel('x'.repeat(80))).toHaveLength(60);
  });
});
