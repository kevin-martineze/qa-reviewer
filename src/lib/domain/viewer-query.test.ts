import { describe, expect, it } from 'vitest';
import { compareSrc, compareTargets, parseViewerQuery, viewerQueryHref } from './viewer-query';

const both = { previous: '/r1.svg', before: '/base.svg' };
const none = { previous: null, before: null };

describe('parseViewerQuery', () => {
  it('lee comparación, modo y comentario', () => {
    const q = parseViewerQuery(new URLSearchParams('compare=base&mode=slider&comment=c1'), both);
    expect(q).toEqual({ compare: 'base', mode: 'slider', comment: 'c1' });
  });

  it('descarta una comparación que la pantalla no tiene', () => {
    expect(parseViewerQuery(new URLSearchParams('compare=previous'), none).compare).toBe('none');
  });

  it('valores raros vuelven al default', () => {
    expect(parseViewerQuery(new URLSearchParams('compare=x&mode=y'), both)).toMatchObject({
      compare: 'none',
      mode: 'side',
    });
  });
});

describe('viewerQueryHref', () => {
  it('sin comparación no escribe el modo', () => {
    expect(viewerQueryHref({ compare: 'none', mode: 'slider', comment: null }, {})).toBe('?');
  });
  it('escribe solo lo distinto del default', () => {
    const q = { compare: 'none', mode: 'side', comment: null } as const;
    expect(viewerQueryHref(q, { compare: 'previous', mode: 'toggle' })).toBe(
      '?compare=previous&mode=toggle',
    );
  });
});

describe('compareTargets / compareSrc', () => {
  it('ofrece solo lo que existe', () => {
    expect(compareTargets({ previous: null, before: '/b.svg' })).toEqual(['none', 'base']);
    expect(compareSrc(both, 'previous')).toBe('/r1.svg');
    expect(compareSrc(both, 'none')).toBeNull();
  });
});
