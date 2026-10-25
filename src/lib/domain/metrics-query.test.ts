import { describe, expect, it } from 'vitest';

import { metricsQueryHref, parseMetricsQuery } from './metrics-query';

describe('metrics query', () => {
  it('descarta proyectos que no se ven y rangos raros', () => {
    expect(parseMetricsQuery(new URLSearchParams('project=x&range=7'), ['lideris'])).toEqual({
      project: '',
      range: 90,
    });
  });
  it('omite los valores por defecto en la URL', () => {
    expect(metricsQueryHref({ project: '', range: 90 }, { project: 'lideris' })).toBe(
      '?project=lideris',
    );
    expect(metricsQueryHref({ project: 'lideris', range: 90 }, { range: 30 })).toBe(
      '?project=lideris&range=30',
    );
  });
});
