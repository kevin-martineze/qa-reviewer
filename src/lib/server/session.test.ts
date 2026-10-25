import { describe, expect, it } from 'vitest';
import { afterProjectSwitch } from './session';

describe('afterProjectSwitch', () => {
  it('sale de una revisión al listado', () => {
    expect(afterProjectSwitch('/reviews/QR-0011/rounds', 'auralis')).toBe('/reviews');
  });
  it('cambia el proyecto de los ajustes', () => {
    expect(afterProjectSwitch('/projects/lideris/settings/members', 'auralis')).toBe(
      '/projects/auralis/settings',
    );
  });
  it('conserva el resto de rutas con su query', () => {
    expect(afterProjectSwitch('/reviews?status=open', 'auralis')).toBe('/reviews?status=open');
  });
});
