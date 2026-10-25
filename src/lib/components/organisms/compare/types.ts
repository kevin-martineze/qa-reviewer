import type { Component, Snippet } from 'svelte';

import type { CompareMode } from '$lib/domain/viewer-query';

export interface CompareProps {
  /** Imagen de referencia (ronda anterior o develop). */
  beforeSrc: string;
  beforeLabel: string;
  afterLabel: string;
  /** La captura actual con sus capas (pins, diff, inspector). */
  after: Snippet;
}

export type CompareRegistry = Record<CompareMode, Component<CompareProps>>;
