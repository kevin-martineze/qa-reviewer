import type { Anchor, ElementRef, ScreenElement } from '$lib/api/types';

// Punto normalizado (fracciones 0–1) → elemento cuyo box lo contiene.
export function elementAt(elements: readonly ScreenElement[], point: Anchor): ElementRef | null {
  for (const el of elements) {
    const { x, y, w, h } = el.box;
    if (point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h) {
      return { name: el.name, file: el.file, line: el.line, selector: el.selector };
    }
  }
  return null;
}

export function anchorToPixels(
  anchor: Anchor,
  viewport: { width: number; height: number },
): { x: number; y: number } {
  return { x: Math.round(anchor.x * viewport.width), y: Math.round(anchor.y * viewport.height) };
}
