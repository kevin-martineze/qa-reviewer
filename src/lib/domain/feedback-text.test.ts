import { describe, expect, it } from 'vitest';
import { makeComment, makeReview, makeScreen } from '$lib/testing/factories';
import { feedbackText } from './feedback-text';

const now = new Date('2026-10-25T20:00:00Z');

const review = makeReview({
  round: 2,
  screens: [
    makeScreen({ key: 'a', title: 'Pantalla A', verdict: 'approved' }),
    makeScreen({ key: 'b', title: 'Pantalla B', verdict: 'changes_requested' }),
  ],
});

describe('feedbackText', () => {
  it('incluye estado, ajustes y comentarios abiertos', () => {
    const comment = makeComment({ screen: 'b', body: 'Revisa el contraste.' });
    const text = feedbackText(review, [comment], { u1: 'Kevin', u2: 'Laura' }, now);
    expect(text).toContain('$ /design-review status QR-0001');
    expect(text).toContain('QR-0001 · LIDER-1 · PR #1 · Ronda 2');
    expect(text).toContain('Estado: En revisión · revisa Laura · Mañana');
    expect(text).toContain('Pantallas: 1 aprobadas · 1 con ajuste · 0 sin veredicto');
    expect(text).toContain('b · Pantalla B');
    expect(text).toContain('de la ronda 1, diseño aún no confirma');
    expect(text).toContain('Laura: «Revisa el contraste.»');
  });

  it('incluye archivo, línea y selector cuando el pin apunta a un componente', () => {
    const comment = makeComment({
      screen: 'b',
      round: 2,
      el: { name: 'itemRow · Card', file: 'src/Row.svelte', line: 316, selector: '.card' },
    });
    const text = feedbackText(review, [comment], {}, now);
    expect(text).toContain('nuevo en la ronda 2');
    expect(text).toContain('src/Row.svelte:316');
    expect(text).toContain('itemRow · Card · .card');
  });

  it('omite los resueltos', () => {
    const text = feedbackText(review, [makeComment({ resolved: true })], {}, now);
    expect(text).toContain('Comentarios abiertos (0)');
  });
});
