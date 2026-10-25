import { describe, expect, it } from 'vitest';

import { changePasswordSchema, tokenSchema } from './account';

describe('changePasswordSchema', () => {
  const ok = { current: 'actual-123', password: 'una-clave-larga', confirm: 'una-clave-larga' };

  it('acepta una contraseña nueva válida', () => {
    expect(changePasswordSchema.safeParse(ok).success).toBe(true);
  });
  it('exige que coincidan', () => {
    const r = changePasswordSchema.safeParse({ ...ok, confirm: 'otra' });
    expect(r.success).toBe(false);
  });
  it('exige que sea distinta de la actual', () => {
    const r = changePasswordSchema.safeParse({
      current: 'una-clave-larga',
      password: 'una-clave-larga',
      confirm: 'una-clave-larga',
    });
    expect(r.success).toBe(false);
  });
});

describe('tokenSchema', () => {
  it('exige nombre y proyecto', () => {
    expect(tokenSchema.safeParse({ label: ' ', projectId: 'lideris' }).success).toBe(false);
    expect(tokenSchema.safeParse({ label: 'Laptop', projectId: '' }).success).toBe(false);
    expect(tokenSchema.safeParse({ label: 'Laptop', projectId: 'lideris' }).success).toBe(true);
  });
});
