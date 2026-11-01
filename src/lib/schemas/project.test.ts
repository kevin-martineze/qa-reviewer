import { describe, expect, it } from 'vitest';

import {
  assignmentSchema,
  integrationsSchema,
  lines,
  newProjectSchema,
  slaSchema,
  toSlug,
} from './project';

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

describe('toSlug', () => {
  it('quita tildes, espacios y signos', () => {
    expect(toSlug('  Portal de Pagos · Ñandú  ')).toBe('portal-de-pagos-nandu');
  });
  it('no deja guiones al final al recortar', () => {
    expect(toSlug(`${'a'.repeat(39)} b`)).toBe('a'.repeat(39));
  });
});

describe('newProjectSchema', () => {
  const base = { name: 'Portal', id: 'portal', repo: '', planeKey: '' };
  it('acepta repo y clave vacíos y normaliza mayúsculas', () => {
    expect(newProjectSchema.parse({ ...base, id: 'Portal', planeKey: 'port' })).toEqual({
      ...base,
      planeKey: 'PORT',
    });
  });
  it('rechaza identificadores con espacios o guiones sueltos', () => {
    expect(newProjectSchema.safeParse({ ...base, id: 'mi portal' }).success).toBe(false);
    expect(newProjectSchema.safeParse({ ...base, id: '-portal' }).success).toBe(false);
    expect(newProjectSchema.safeParse({ ...base, id: 'p' }).success).toBe(false);
  });
  it('el repo va como dueño/repositorio', () => {
    expect(newProjectSchema.safeParse({ ...base, repo: 'estudio-norte/web' }).success).toBe(true);
    expect(newProjectSchema.safeParse({ ...base, repo: 'web' }).success).toBe(false);
  });
});
