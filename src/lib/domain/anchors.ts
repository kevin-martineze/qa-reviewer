import type { Anchor, ElementRef, ScreenElement } from '$lib/api/types';

function contains(el: ScreenElement, point: Anchor): boolean {
  const { x, y, w, h } = el.box;
  return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
}

/** Elemento más pequeño que contiene el punto (fracciones 0–1): el más específico. */
export function elementAt(elements: readonly ScreenElement[], point: Anchor): ScreenElement | null {
  let best: ScreenElement | null = null;
  for (const el of elements) {
    if (!contains(el, point)) continue;
    if (!best || el.box.w * el.box.h < best.box.w * best.box.h) best = el;
  }
  return best;
}

export function toElementRef(el: ScreenElement): ElementRef {
  return { name: el.name, file: el.file, line: el.line, selector: el.selector };
}

export function anchorToPixels(
  anchor: Anchor,
  viewport: { width: number; height: number },
): { x: number; y: number } {
  return { x: Math.round(anchor.x * viewport.width), y: Math.round(anchor.y * viewport.height) };
}

/** Punto del clic (en px dentro del rect de la imagen) → fracciones 0–1, recortado a la imagen. */
export function pixelsToAnchor(
  point: { x: number; y: number },
  rect: { width: number; height: number },
): Anchor {
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  return { x: clamp(point.x / rect.width), y: clamp(point.y / rect.height) };
}
