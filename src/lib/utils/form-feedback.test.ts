import { describe, expect, it } from 'vitest';
import { formFeedback } from './form-feedback';

describe('formFeedback', () => {
  it('error gana sobre message', () => {
    expect(formFeedback({ error: 'x', message: 'y' })).toEqual({ kind: 'error', text: 'x' });
  });
  it('message es éxito', () => {
    expect(formFeedback({ ok: true, message: 'Listo' })).toEqual({
      kind: 'success',
      text: 'Listo',
    });
  });
  it('sin texto no hay toast', () => {
    expect(formFeedback(null)).toBeNull();
    expect(formFeedback({ errors: { email: 'x' } })).toBeNull();
  });
});
