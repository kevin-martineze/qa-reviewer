// Filtros del listado de revisiones en la URL (CLAUDE.md regla 16).
// Una sola fuente: el server parsea con `parseReviewQuery` y la UI arma los
// enlaces con `reviewQueryHref`, así back/forward, refresh y compartir funcionan.
import type { ReviewFilters, ReviewSort } from '$lib/api/ports';
import type { Priority, ReviewStatus } from '$lib/api/types';

export const STATUS_VIEWS = {
  open: { label: 'Pendientes', statuses: ['open', 'in_review'] },
  changes: { label: 'Requieren ajustes', statuses: ['changes_requested'] },
  approved: { label: 'Aprobadas', statuses: ['approved'] },
  closed: { label: 'Cerradas', statuses: ['closed'] },
  all: { label: 'Todas', statuses: [] },
} as const satisfies Record<string, { label: string; statuses: readonly ReviewStatus[] }>;

export type StatusView = keyof typeof STATUS_VIEWS;

export const VIEW_KEYS: readonly StatusView[] = ['open', 'changes', 'approved', 'closed', 'all'];

export const SORTS: Record<ReviewSort, string> = {
  updated: 'Actividad reciente',
  due: 'Vence primero',
  priority: 'Prioridad',
};

export const PAGE_SIZE = 10;

export interface ReviewQuery {
  view: StatusView;
  q: string;
  /** `''` = cualquiera, `me` = el usuario de la sesión, o un id. */
  assignee: string;
  author: string;
  priority: Priority | '';
  overdue: boolean;
  sort: ReviewSort;
  page: number;
}

export const DEFAULT_QUERY: ReviewQuery = {
  view: 'open',
  q: '',
  assignee: '',
  author: '',
  priority: '',
  overdue: false,
  sort: 'updated',
  page: 1,
};

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'medium', 'low'];

function isView(v: string | null): v is StatusView {
  return v !== null && v in STATUS_VIEWS;
}
export function isSort(v: string | null): v is ReviewSort {
  return v !== null && v in SORTS;
}
export function isPriority(v: string | null): v is Priority {
  return PRIORITIES.some((p) => p === v);
}

export function parseReviewQuery(params: URLSearchParams): ReviewQuery {
  const view = params.get('view');
  const sort = params.get('sort');
  const priority = params.get('priority');
  const page = Number.parseInt(params.get('page') ?? '', 10);
  return {
    view: isView(view) ? view : DEFAULT_QUERY.view,
    q: (params.get('q') ?? '').trim().slice(0, 100),
    assignee: params.get('assignee') ?? '',
    author: params.get('author') ?? '',
    priority: isPriority(priority) ? priority : '',
    overdue: params.get('overdue') === '1',
    sort: isSort(sort) ? sort : DEFAULT_QUERY.sort,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Traduce la query de la URL a los filtros del puerto. */
export function toReviewFilters(
  query: ReviewQuery,
  ctx: { userId: string; projectId: string | null },
): ReviewFilters {
  const resolveUser = (v: string) => (v === 'me' ? ctx.userId : v || undefined);
  return {
    project: ctx.projectId ?? undefined,
    status: [...STATUS_VIEWS[query.view].statuses],
    q: query.q || undefined,
    assignee: resolveUser(query.assignee),
    author: resolveUser(query.author),
    priority: query.priority || undefined,
    overdue: query.overdue || undefined,
    sort: query.sort,
    page: query.page,
    limit: PAGE_SIZE,
  };
}

/** `?…` con solo los valores distintos del default. Cambiar un filtro vuelve a la página 1. */
export function reviewQueryHref(current: ReviewQuery, patch: Partial<ReviewQuery>): string {
  const next: ReviewQuery = { ...current, page: 1, ...patch };
  const params = new URLSearchParams();
  if (next.view !== DEFAULT_QUERY.view) params.set('view', next.view);
  if (next.q) params.set('q', next.q);
  if (next.assignee) params.set('assignee', next.assignee);
  if (next.author) params.set('author', next.author);
  if (next.priority) params.set('priority', next.priority);
  if (next.overdue) params.set('overdue', '1');
  if (next.sort !== DEFAULT_QUERY.sort) params.set('sort', next.sort);
  if (next.page > 1) params.set('page', String(next.page));
  const search = params.toString();
  return search ? `?${search}` : '?';
}

/** Hay filtros además de la vista (para mostrar «Limpiar filtros»). */
export function hasFilters(q: ReviewQuery): boolean {
  return Boolean(q.q || q.assignee || q.author || q.priority || q.overdue);
}
