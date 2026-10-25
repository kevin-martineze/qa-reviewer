import { describe, expect, it } from 'vitest';
import {
  DEFAULT_QUERY,
  hasFilters,
  PAGE_SIZE,
  parseReviewQuery,
  reviewQueryHref,
  toReviewFilters,
} from './review-query';

const parse = (s: string) => parseReviewQuery(new URLSearchParams(s));

describe('parseReviewQuery', () => {
  it('sin parámetros da los defaults', () => {
    expect(parse('')).toEqual(DEFAULT_QUERY);
  });

  it('ignora valores inválidos', () => {
    const q = parse('view=nope&sort=x&priority=mega&page=-3');
    expect(q.view).toBe('open');
    expect(q.sort).toBe('updated');
    expect(q.priority).toBe('');
    expect(q.page).toBe(1);
  });

  it('lee todos los filtros', () => {
    expect(
      parse(
        'view=closed&q=%20pagos%20&assignee=me&author=u5&priority=urgent&overdue=1&sort=due&page=2',
      ),
    ).toEqual({
      view: 'closed',
      q: 'pagos',
      assignee: 'me',
      author: 'u5',
      priority: 'urgent',
      overdue: true,
      sort: 'due',
      page: 2,
    });
  });
});

describe('toReviewFilters', () => {
  it('resuelve «me» y el proyecto activo', () => {
    const f = toReviewFilters(parse('assignee=me'), { userId: 'u2', projectId: 'lideris' });
    expect(f).toMatchObject({
      project: 'lideris',
      assignee: 'u2',
      status: ['open', 'in_review'],
      limit: PAGE_SIZE,
    });
  });

  it('«todas» no filtra por estado', () => {
    expect(toReviewFilters(parse('view=all'), { userId: 'u1', projectId: null }).status).toEqual(
      [],
    );
  });
});

describe('reviewQueryHref', () => {
  it('omite los defaults', () => {
    expect(reviewQueryHref(DEFAULT_QUERY, {})).toBe('?');
  });

  it('cambiar un filtro vuelve a la página 1', () => {
    const current = parse('page=3&sort=due');
    expect(reviewQueryHref(current, { priority: 'high' })).toBe('?priority=high&sort=due');
  });

  it('paginar conserva los filtros', () => {
    const current = parse('view=all&q=caja');
    expect(reviewQueryHref(current, { page: 2 })).toBe('?view=all&q=caja&page=2');
  });
});

describe('hasFilters', () => {
  it('la vista sola no cuenta como filtro', () => {
    expect(hasFilters(parse('view=closed'))).toBe(false);
    expect(hasFilters(parse('overdue=1'))).toBe(true);
  });
});
