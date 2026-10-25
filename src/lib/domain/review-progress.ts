import type { Screen } from '$lib/api/types';

export interface Progress {
  total: number;
  approved: number;
  changes: number;
  done: number;
  pending: number;
}

export function progressOf(screens: ReadonlyArray<Screen>): Progress {
  const approved = screens.filter((s) => s.verdict === 'approved').length;
  const changes = screens.filter((s) => s.verdict === 'changes_requested').length;
  const total = screens.length;
  const done = approved + changes;
  return { total, approved, changes, done, pending: total - done };
}
