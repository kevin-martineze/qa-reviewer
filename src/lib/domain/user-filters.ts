export const STATUS_FILTERS = ['active', 'inactive', 'all'] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  active: 'Activos',
  inactive: 'Desactivados',
  all: 'Todos',
};

export function isStatusFilter(v: string | null): v is StatusFilter {
  return STATUS_FILTERS.some((s) => s === v);
}

/** `?status=…&q=…` para la lista de usuarios; `active` es el valor por defecto. */
export function usersQueryHref(current: { q: string; status: StatusFilter }, status: StatusFilter) {
  const params = new URLSearchParams();
  if (status !== 'active') params.set('status', status);
  if (current.q) params.set('q', current.q);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
