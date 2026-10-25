import { describe, expect, it } from 'vitest';
import type { ScreenElement } from '$lib/api/types';
import { anchorToPixels, elementAt } from './anchors';

const row: ScreenElement = {
  id: 'row-1',
  name: 'itemRow · Card',
  file: 'src/Row.svelte',
  line: 10,
  selector: '[data-slot="card"]',
  box: { x: 0.2, y: 0.4, w: 0.6, h: 0.2 },
};

describe('elementAt', () => {
  it('devuelve el elemento cuyo box contiene el punto', () => {
    const el = elementAt([row], { x: 0.5, y: 0.5 });
    expect(el).toEqual({ name: row.name, file: row.file, line: row.line, selector: row.selector });
  });

  it('devuelve null si ningún box lo contiene', () => {
    expect(elementAt([row], { x: 0.1, y: 0.1 })).toBeNull();
  });
});

describe('anchorToPixels', () => {
  it('convierte fracciones a píxeles del viewport', () => {
    expect(anchorToPixels({ x: 0.5, y: 0.25 }, { width: 1280, height: 720 })).toEqual({
      x: 640,
      y: 180,
    });
  });
});
