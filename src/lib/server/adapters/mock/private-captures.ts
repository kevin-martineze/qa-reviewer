// Capturas reales de Lideris para el mock, SOLO locales: las genera
// `scripts/capture-lideris.mjs` en fixtures-private/lideris (gitignored).
// Fuera de static/ a propósito: static/ se copia al build y quedaría público.
// Si no existen, el mock sigue con los SVG sintéticos de scenes.ts.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { z } from 'zod';

import type { Box } from '$lib/api/types';

export const PRIVATE_DIR = join(process.cwd(), 'fixtures-private', 'lideris');

const boxSchema = z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() });

const captureSchema = z.object({
  file: z.string().regex(/^[a-z0-9-]+\.png$/),
  width: z.number(),
  height: z.number(),
  /** Cajas medidas en la página real, por selector y en orden de aparición. */
  boxes: z.record(z.string(), z.array(boxSchema)),
});

export type PrivateCapture = z.infer<typeof captureSchema>;

function load(): Record<string, PrivateCapture> {
  const path = join(PRIVATE_DIR, 'manifest.json');
  if (!existsSync(path)) return {};
  try {
    const parsed = z
      .record(z.string(), captureSchema)
      .safeParse(JSON.parse(readFileSync(path, 'utf8')));
    if (parsed.success) return parsed.data;
    console.warn('[mock] fixtures-private/lideris/manifest.json no es válido; uso los SVG.');
  } catch {
    console.warn('[mock] No pude leer fixtures-private/lideris/manifest.json; uso los SVG.');
  }
  return {};
}

const CAPTURES = load();

export function privateCapture(sceneId: string): PrivateCapture | undefined {
  return CAPTURES[sceneId];
}

/** Caja k-ésima medida para un selector, si la página real la tenía. */
export function measuredBox(sceneId: string, selector: string, index: number): Box | undefined {
  return CAPTURES[sceneId]?.boxes[selector]?.[index];
}
