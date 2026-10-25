import { describe, expect, it } from 'vitest';
import { loginSchema } from './auth';
import { fieldErrors, formObject } from './form-errors';

describe('loginSchema', () => {
  it('normaliza el correo', () => {
    const r = loginSchema.safeParse({ email: '  Laura@Ejemplo.CO ', password: 'x' });
    expect(r.success && r.data.email).toBe('laura@ejemplo.co');
  });

  it('da un error por campo', () => {
    const r = loginSchema.safeParse({ email: 'no', password: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(fieldErrors(r.error)).toEqual({
        email: 'Escribe un correo válido.',
        password: 'Escribe tu contraseña.',
      });
    }
  });
});

describe('formObject', () => {
  it('convierte los campos ausentes en texto vacío', () => {
    const fd = new FormData();
    fd.set('email', 'a@b.co');
    expect(formObject(fd, ['email', 'password'])).toEqual({ email: 'a@b.co', password: '' });
  });
});
