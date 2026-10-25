import { describe, expect, it } from 'vitest';
import type { Comment, Review } from '$lib/api/types';
import { feedbackText } from './feedback-text';

const review: Review = {
  id: 'QR-0001',
  title: 'Título',
  context: 'ctx',
  card: 'LIDER-1',
  pr: 1,
  base: 'main',
  head: 'feat/x',
  project: 'lideris',
  module: 'Módulo',
  author: 'u1',
  assignees: ['u2'],
  status: 'in_review',
  round: 2,
  priority: 'media',
  due: { label: 'Mañana', tone: 'soon' },
  updated: 'Hoy',
  screens: [
    {
      key: 'a',
      title: 'Pantalla A',
      lead: '',
      vp: '1280 × 720',
      route: '/x',
      img: null,
      before: null,
      elements: [],
      changes: [],
      questions: [],
      verdict: 'approved',
    },
    {
      key: 'b',
      title: 'Pantalla B',
      lead: '',
      vp: '1280 × 720',
      route: '/x',
      img: null,
      before: null,
      elements: [],
      changes: [],
      questions: [],
      verdict: 'changes_requested',
    },
  ],
  rounds: [],
  summary: { steps: [], rules: [] },
  notCaptured: [],
};

const comment: Comment = {
  id: 'c1',
  review: 'QR-0001',
  screen: 'b',
  round: 1,
  author: 'u2',
  when: 'Ayer',
  body: 'Revisa el contraste.',
  anchor: null,
  el: null,
  resolved: false,
  followUp: null,
  replies: [],
};

describe('feedbackText', () => {
  it('incluye estado, ajustes y comentarios abiertos', () => {
    const text = feedbackText(review, [comment], { u1: 'Kevin', u2: 'Laura' });
    expect(text).toContain('$ /design-review status QR-0001');
    expect(text).toContain('Pantallas: 1 aprobadas · 1 con ajuste · 0 sin veredicto');
    expect(text).toContain('Ajuste pedido en');
    expect(text).toContain('b · Pantalla B');
    expect(text).toContain('Laura: «Revisa el contraste.»');
  });
});
