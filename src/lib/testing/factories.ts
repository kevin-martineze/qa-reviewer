// Fábricas para pruebas: un objeto válido del contrato con lo mínimo, más overrides.
import type { Comment, Review, Round, Screen } from '$lib/api/types';

export function makeScreen(overrides: Partial<Screen> = {}): Screen {
  return {
    key: 'a',
    title: 'Pantalla',
    lead: '',
    viewport: '1280 × 720',
    route: '/x',
    img: null,
    before: null,
    previous: null,
    changedIn: 1,
    inherited: false,
    roundNote: null,
    diff: [],
    elements: [],
    changes: [],
    questions: [],
    verdict: 'pending',
    ...overrides,
  };
}

export function makeRound(overrides: Partial<Round> = {}): Round {
  return {
    n: 1,
    by: 'u1',
    createdAt: '2026-10-24T19:31:00Z',
    note: null,
    changed: [],
    verdicts: {},
    submission: null,
    ...overrides,
  };
}

export function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: 'QR-0001',
    title: 'Título',
    context: 'ctx',
    card: 'LIDER-1',
    pr: {
      number: 1,
      url: 'https://github.com/org/repo/pull/1',
      base: 'develop',
      head: 'feat/x',
      state: 'open',
      check: 'pending',
      commit: 'abc1234',
    },
    project: 'lideris',
    module: 'Módulo',
    author: 'u1',
    assignees: ['u2'],
    status: 'in_review',
    round: 1,
    priority: 'medium',
    dueAt: '2026-10-26T22:00:00Z',
    createdAt: '2026-10-24T19:31:00Z',
    updatedAt: '2026-10-25T15:05:00Z',
    screens: [],
    rounds: [],
    summary: { steps: [], rules: [] },
    notCaptured: [],
    ...overrides,
  };
}

export function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 'c1',
    review: 'QR-0001',
    screen: 'a',
    round: 1,
    author: 'u2',
    createdAt: '2026-10-24T21:58:00Z',
    body: 'x',
    anchor: null,
    el: null,
    resolved: false,
    followUp: null,
    replies: [],
    ...overrides,
  };
}
