import { describe, expect, it } from 'vitest';
import { safeRedirectTo } from './security';

describe('safeRedirectTo', () => {
  it('acepta rutas internas absolutas', () => {
    expect(safeRedirectTo('/reviews')).toBe('/reviews');
    expect(safeRedirectTo('/reviews/QR-0012?round=2')).toBe('/reviews/QR-0012?round=2');
  });

  it('rechaza rutas externas', () => {
    expect(safeRedirectTo('https://evil.example')).toBeNull();
    expect(safeRedirectTo('//evil.example')).toBeNull();
  });

  it('rechaza vacío y relativas', () => {
    expect(safeRedirectTo('')).toBeNull();
    expect(safeRedirectTo(null)).toBeNull();
    expect(safeRedirectTo(undefined)).toBeNull();
    expect(safeRedirectTo('reviews')).toBeNull();
  });
});
