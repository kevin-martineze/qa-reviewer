import { describe, expect, it } from 'vitest';

import { assignmentSchema, integrationsSchema, lines, slaSchema } from './project';

describe('lines', () => {
  it('separa por línea sin vacías ni repetidas', () => {
    expect(lines(' a \n\nb\na\n')).toEqual(['a', 'b']);
  });
});

describe('slaSchema', () => {
  it('convierte el texto a número', () => {
    expect(slaSchema.parse({ slaDays: '3' })).toEqual({ slaDays: 3 });
  });
  it('rechaza fuera de rango y decimales', () => {
    expect(slaSchema.safeParse({ slaDays: '0' }).success).toBe(false);
    expect(slaSchema.safeParse({ slaDays: '40' }).success).toBe(false);
    expect(slaSchema.safeParse({ slaDays: '1.5' }).success).toBe(false);
  });
});

describe('assignmentSchema', () => {
  it('por módulo exige al menos una regla', () => {
    const r = assignmentSchema.safeParse({ strategy: 'by_module', moduleRules: [] });
    expect(r.success).toBe(false);
  });
  it('rechaza rutas sin barra o repetidas', () => {
    expect(
      assignmentSchema.safeParse({
        strategy: 'by_module',
        moduleRules: [{ pattern: 'preorders', userId: 'u2' }],
      }).success,
    ).toBe(false);
    expect(
      assignmentSchema.safeParse({
        strategy: 'by_module',
        moduleRules: [
          { pattern: '/a/*', userId: 'u2' },
          { pattern: '/a/*', userId: 'u3' },
        ],
      }).success,
    ).toBe(false);
  });
  it('manual no necesita reglas', () => {
    expect(assignmentSchema.safeParse({ strategy: 'manual', moduleRules: [] }).success).toBe(true);
  });
});

describe('integrationsSchema', () => {
  it('valida el nombre del check', () => {
    const base = { commentOnPr: true, commentOnCard: false };
    expect(integrationsSchema.safeParse({ ...base, checkName: 'design-review' }).success).toBe(
      true,
    );
    expect(integrationsSchema.safeParse({ ...base, checkName: 'Design Review' }).success).toBe(
      false,
    );
  });
});
