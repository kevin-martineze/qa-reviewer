import type { AuditType } from '$lib/api/types';
import { AUDIT_TYPE } from '$lib/domain/labels';

export const AUDIT_PAGE_SIZE = 20;

export interface AuditQuery {
  type: AuditType | '';
  actor: string;
  page: number;
}

export function isAuditType(v: string): v is AuditType {
  return Object.keys(AUDIT_TYPE).includes(v);
}

export function parseAuditQuery(params: URLSearchParams): AuditQuery {
  const type = params.get('type') ?? '';
  const page = Number(params.get('page') ?? '1');
  return {
    type: isAuditType(type) ? type : '',
    actor: params.get('actor') ?? '',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** `?type=…&actor=…&page=…`; cambiar un filtro vuelve a la página 1. */
export function auditQueryHref(current: AuditQuery, patch: Partial<AuditQuery>): string {
  const next = { ...current, ...patch };
  if (!('page' in patch)) next.page = 1;
  const params = new URLSearchParams();
  if (next.type) params.set('type', next.type);
  if (next.actor) params.set('actor', next.actor);
  if (next.page > 1) params.set('page', String(next.page));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
