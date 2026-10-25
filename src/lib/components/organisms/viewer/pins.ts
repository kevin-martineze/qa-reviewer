import type { Anchor } from '$lib/api/types';

export interface Pin {
  id: string;
  /** Número visible (orden del hilo en la pantalla). */
  n: number;
  anchor: Anchor;
  resolved: boolean;
}
