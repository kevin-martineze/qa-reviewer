import { dayGroupLabel, dayKey } from './dates';

export interface DayGroup<T> {
  key: string;
  label: string;
  items: T[];
}

/** Agrupa una lista ya ordenada (más reciente primero) por día de Bogotá. */
export function groupByDay<T extends { createdAt: string }>(
  items: readonly T[],
  now: Date,
): DayGroup<T>[] {
  const groups: DayGroup<T>[] = [];
  for (const item of items) {
    const key = dayKey(new Date(item.createdAt));
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, label: dayGroupLabel(item.createdAt, now), items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}
