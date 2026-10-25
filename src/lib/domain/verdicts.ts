import type { Round, Verdict } from '$lib/api/types';

export interface VerdictCounts {
  approved: number;
  changes: number;
  pending: number;
}

export function verdictCounts(verdicts: Iterable<Verdict>): VerdictCounts {
  const counts: VerdictCounts = { approved: 0, changes: 0, pending: 0 };
  for (const v of verdicts) {
    if (v === 'approved') counts.approved += 1;
    else if (v === 'changes_requested') counts.changes += 1;
    else counts.pending += 1;
  }
  return counts;
}

// Una pantalla hereda el veredicto de la ronda anterior si NO cambió en la ronda nueva.
export function inheritedVerdict(prevRound: Round | undefined, screenKey: string): Verdict | null {
  if (!prevRound?.verdicts) return null;
  return prevRound.verdicts[screenKey] ?? null;
}

// Verdicts de la ronda nueva: hereda el previo salvo en pantallas recapturadas (changedKeys).
export function nextRoundVerdicts(
  prevRound: Round | undefined,
  screenKeys: readonly string[],
  changedKeys: readonly string[] = [],
): Record<string, Verdict> {
  const changed = new Set(changedKeys);
  const out: Record<string, Verdict> = {};
  for (const key of screenKeys) {
    out[key] = changed.has(key) ? 'pending' : (inheritedVerdict(prevRound, key) ?? 'pending');
  }
  return out;
}
