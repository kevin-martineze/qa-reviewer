import type { Tone } from '$lib/domain/tone';

/** Clases de tokens por tono. Única tabla de colores semánticos de la UI. */
export const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-secondary text-secondary-foreground',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  muted: 'bg-muted text-muted-foreground',
};

export const TONE_DOT: Record<Tone, string> = {
  neutral: 'bg-foreground/60',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  muted: 'bg-muted-foreground/50',
};
