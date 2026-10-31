import type { Review } from '$lib/api/types';
import { formatDay } from '$lib/utils/dates';
import type { Tone } from './tone';

const HOUR = 3_600_000;

export interface DueState {
  label: string;
  tone: Tone;
  overdue: boolean;
}

/** Estado del plazo de una revisión. Solo corre mientras diseño tiene la pelota. */
export function dueState(review: Pick<Review, 'status' | 'dueAt' | 'pr'>, now: Date): DueState {
  if (review.status === 'approved') return { label: 'Aprobada', tone: 'muted', overdue: false };
  if (review.status === 'closed') {
    const label = review.pr.state === 'merged' ? 'PR fusionado' : 'Cerrada';
    return { label, tone: 'muted', overdue: false };
  }
  if (review.status === 'changes_requested') {
    return { label: 'Esperando al autor', tone: 'muted', overdue: false };
  }
  if (!review.dueAt) return { label: 'Sin plazo', tone: 'muted', overdue: false };

  const left = new Date(review.dueAt).getTime() - now.getTime();
  const day = formatDay(review.dueAt, now);
  if (left < 0) return { label: `Venció · ${day}`, tone: 'danger', overdue: true };
  if (left < 24 * HOUR) return { label: day, tone: 'warning', overdue: false };
  return { label: day, tone: 'neutral', overdue: false };
}

/** Diseño tiene la pelota: la revisión espera veredicto. */
export function awaitingDesign(review: Pick<Review, 'status'>): boolean {
  return review.status === 'open' || review.status === 'in_review';
}

/** Suma días hábiles (lunes a viernes, en UTC) conservando la hora. */
export function addBusinessDays(from: Date, days: number): Date {
  const out = new Date(from);
  let left = days;
  while (left > 0) {
    out.setUTCDate(out.getUTCDate() + 1);
    const weekday = out.getUTCDay();
    if (weekday !== 0 && weekday !== 6) left -= 1;
  }
  return out;
}
