import { describe, expect, it } from 'vitest';
import type { ScreenElement } from '$lib/api/types';
import { anchorToPixels, elementAt, pixelsToAnchor, toElementRef } from './anchors';

const row: ScreenElement = {
  id: 'row-1',
  name: 'itemRow · Card',
  file: 'src/Row.svelte',
  line: 10,
  selector: '[data-slot="card"]',
  box: { x: 0.2, y: 0.4, w: 0.6, h: 0.2 },
};

const stepper: ScreenElement = {
  id: 'stepper-1',
  name: 'QuantityStepper',
  file: 'src/Stepper.svelte',
  line: 3,
  selector: 'input',
  box: { x: 0.6, y: 0.45, w: 0.1, h: 0.05 },
};

describe('elementAt', () => {
  it('devuelve el elemento cuyo box contiene el punto', () => {
    expect(elementAt([row], { x: 0.5, y: 0.5 })).toBe(row);
  });

  it('prefiere el elemento más pequeño cuando hay anidados', () => {
    expect(elementAt([row, stepper], { x: 0.65, y: 0.47 })).toBe(stepper);
    expect(elementAt([stepper, row], { x: 0.65, y: 0.47 })).toBe(stepper);
  });

  it('devuelve null si ningún box lo contiene', () => {
    expect(elementAt([row], { x: 0.1, y: 0.1 })).toBeNull();
  });
});

describe('toElementRef', () => {
  it('quita id y box', () => {
    expect(toElementRef(row)).toEqual({
      name: row.name,
      file: row.file,
      line: row.line,
      selector: row.selector,
    });
  });
});

describe('anchorToPixels y pixelsToAnchor', () => {
  it('convierte fracciones a píxeles del viewport', () => {
    expect(anchorToPixels({ x: 0.5, y: 0.25 }, { width: 1280, height: 720 })).toEqual({
      x: 640,
      y: 180,
    });
  });

  it('convierte píxeles a fracciones y recorta fuera de la imagen', () => {
    expect(pixelsToAnchor({ x: 320, y: 90 }, { width: 640, height: 360 })).toEqual({
      x: 0.5,
      y: 0.25,
    });
    expect(pixelsToAnchor({ x: -5, y: 400 }, { width: 640, height: 360 })).toEqual({ x: 0, y: 1 });
  });
});
