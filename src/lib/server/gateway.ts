import { env } from '$env/dynamic/private';
import type { Gateways } from '$lib/api/ports';
import { httpGateway } from './adapters/http';
import { mockGateway } from './adapters/mock';

/** `mock` (por defecto) o `api`. Con `api`, el server habla con API_URL. */
export const REVIEWS_SOURCE: 'mock' | 'api' = env.REVIEWS_SOURCE === 'api' ? 'api' : 'mock';

export const isMock = REVIEWS_SOURCE === 'mock';

export function gateway(locals: App.Locals, fetchFn?: typeof fetch): Gateways {
  if (REVIEWS_SOURCE === 'api') return httpGateway(locals, fetchFn);
  return mockGateway(locals);
}
