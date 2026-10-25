import { describe, expect, it } from 'vitest';
import { commentSchema, verdictSchema } from './comment';

describe('commentSchema', () => {
  it('acepta un comentario con ancla', () => {
    const r = commentSchema.safeParse({
      body: ' Más contraste ',
      ax: '0.25',
      ay: '0.5',
      elementId: 'e1',
    });
    expect(r.success && r.data).toMatchObject({ body: 'Más contraste', ax: 0.25, ay: 0.5 });
  });

  it('acepta un comentario general sin ancla', () => {
    expect(commentSchema.safeParse({ body: 'General', ax: '', ay: '' }).success).toBe(true);
  });

  it('rechaza anclas fuera de la imagen y cuerpo vacío', () => {
    expect(commentSchema.safeParse({ body: 'x', ax: '1.4', ay: '0.2' }).success).toBe(false);
    expect(commentSchema.safeParse({ body: '   ' }).success).toBe(false);
  });
});

describe('verdictSchema', () => {
  it('solo los tres veredictos', () => {
    expect(verdictSchema.safeParse({ verdict: 'approved' }).success).toBe(true);
    expect(verdictSchema.safeParse({ verdict: 'maybe' }).success).toBe(false);
  });
});
