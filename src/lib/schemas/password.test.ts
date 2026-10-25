import { describe, expect, it } from 'vitest';
import { inviteSchema, passwordFormSchema, passwordSchema } from './password';

describe('passwordSchema', () => {
  it('exige mínimo 12 caracteres', () => {
    expect(passwordSchema.safeParse('12345678901').success).toBe(false);
    expect(passwordSchema.safeParse('123456789012').success).toBe(true);
  });
});

describe('passwordFormSchema', () => {
  it('rechaza contraseñas que no coinciden', () => {
    const r = passwordFormSchema.safeParse({ password: '123456789012', confirm: 'otra' });
    expect(r.success).toBe(false);
  });

  it('acepta contraseñas que coinciden y miden 12+', () => {
    const r = passwordFormSchema.safeParse({ password: '123456789012', confirm: '123456789012' });
    expect(r.success).toBe(true);
  });
});

describe('inviteSchema', () => {
  it('exige nombre además de la contraseña', () => {
    const r = inviteSchema.safeParse({
      name: '',
      password: '123456789012',
      confirm: '123456789012',
    });
    expect(r.success).toBe(false);
    const ok = inviteSchema.safeParse({
      name: 'Laura',
      password: '123456789012',
      confirm: '123456789012',
    });
    expect(ok.success).toBe(true);
  });
});
