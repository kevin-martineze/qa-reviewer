import type { Gateways } from '$lib/api/ports';
import { httpGateway } from './adapters/http';
import { mockGateway } from './adapters/mock';

export const REVIEWS_SOURCE = process.env.REVIEWS_SOURCE ?? 'mock';

export function gateway(locals: App.Locals): Gateways {
  if (REVIEWS_SOURCE === 'http') return httpGateway(locals);
  return mockGateway(locals);
}
