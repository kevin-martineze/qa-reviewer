export const RANGES = [30, 90, 180] as const;
export type RangeDays = (typeof RANGES)[number];

export interface MetricsQuery {
  project: string;
  range: RangeDays;
}

export function isRange(v: number): v is RangeDays {
  return RANGES.some((r) => r === v);
}

export function parseMetricsQuery(params: URLSearchParams, projectIds: string[]): MetricsQuery {
  const project = params.get('project') ?? '';
  const range = Number(params.get('range') ?? '90');
  return {
    project: projectIds.includes(project) ? project : '',
    range: isRange(range) ? range : 90,
  };
}

export function metricsQueryHref(current: MetricsQuery, patch: Partial<MetricsQuery>): string {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.project) params.set('project', next.project);
  if (next.range !== 90) params.set('range', String(next.range));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
