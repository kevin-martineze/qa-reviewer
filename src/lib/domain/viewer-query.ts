// Estado del visor que vive en la URL: un enlace abre exactamente la misma vista.
import type { Screen } from '$lib/api/types';

export type CompareTarget = 'none' | 'previous' | 'base';
export type CompareMode = 'side' | 'slider' | 'toggle';

export interface ViewerQuery {
  compare: CompareTarget;
  mode: CompareMode;
  /** Hilo abierto (p. ej. desde una notificación). */
  comment: string | null;
}

const TARGETS: readonly CompareTarget[] = ['none', 'previous', 'base'];
const MODES: readonly CompareMode[] = ['side', 'slider', 'toggle'];

export const MODE_LABEL: Record<CompareMode, string> = {
  side: 'Lado a lado',
  slider: 'Deslizador',
  toggle: 'Alternar',
};

const isTarget = (v: string | null): v is CompareTarget => TARGETS.some((t) => t === v);
const isMode = (v: string | null): v is CompareMode => MODES.some((m) => m === v);

/** Contra qué se puede comparar esta pantalla. */
export function compareTargets(screen: Pick<Screen, 'previous' | 'before'>): CompareTarget[] {
  const out: CompareTarget[] = ['none'];
  if (screen.previous) out.push('previous');
  if (screen.before) out.push('base');
  return out;
}

/** Lee la URL y descarta una comparación que esta pantalla no tiene. */
export function parseViewerQuery(
  params: URLSearchParams,
  screen: Pick<Screen, 'previous' | 'before'>,
): ViewerQuery {
  const compare = params.get('compare');
  const mode = params.get('mode');
  const available = compareTargets(screen);
  return {
    compare: isTarget(compare) && available.includes(compare) ? compare : 'none',
    mode: isMode(mode) ? mode : 'side',
    comment: params.get('comment'),
  };
}

export function viewerQueryHref(current: ViewerQuery, patch: Partial<ViewerQuery>): string {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.compare !== 'none') {
    params.set('compare', next.compare);
    if (next.mode !== 'side') params.set('mode', next.mode);
  }
  if (next.comment) params.set('comment', next.comment);
  const s = params.toString();
  return s ? `?${s}` : '?';
}

/** Imagen contra la que se compara, si hay. */
export function compareSrc(
  screen: Pick<Screen, 'previous' | 'before'>,
  target: CompareTarget,
): string | null {
  if (target === 'previous') return screen.previous;
  if (target === 'base') return screen.before;
  return null;
}
