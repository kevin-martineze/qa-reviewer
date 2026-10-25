// Capturas reales (anonimizadas) de Lideris para la demo del mock. Las genera
// `scripts/capture-lideris.mjs`: los PNG van a static/demo/lideris/ y este manifest
// (lideris-captures.json) trae las cajas medidas de cada componente. Va por
// import.meta.glob para que entre al bundle del server; si falta, el mock usa los SVG.
import { z } from 'zod';

import type { Box } from '$lib/api/types';

const boxSchema = z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() });

const captureSchema = z.object({
  file: z.string().regex(/^[a-z0-9-]+\.png$/),
  width: z.number(),
  height: z.number(),
  /** Cajas medidas en la página real, por selector y en orden de aparición. */
  boxes: z.record(z.string(), z.array(boxSchema)),
});

export type LiderisCapture = z.infer<typeof captureSchema>;

const files = import.meta.glob<unknown>('./lideris-captures.json', {
  eager: true,
  import: 'default',
});

function load(): Record<string, LiderisCapture> {
  const raw = Object.values(files)[0];
  if (raw === undefined) return {};
  const parsed = z.record(z.string(), captureSchema).safeParse(raw);
  if (parsed.success) return parsed.data;
  console.warn('[mock] lideris-captures.json no es válido; uso los SVG.');
  return {};
}

const CAPTURES = load();

export function liderisCapture(sceneId: string): LiderisCapture | undefined {
  return CAPTURES[sceneId];
}

/** Caja k-ésima medida para un selector, si la página real la tenía. */
export function measuredBox(sceneId: string, selector: string, index: number): Box | undefined {
  return CAPTURES[sceneId]?.boxes[selector]?.[index];
}
