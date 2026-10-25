// Cliente HTTP del API: envoltorio `{ messageKey, data }` → Result<T>. Nunca lanza.
import { env } from '$env/dynamic/private';
import { err, ok, type Result } from '$lib/api/result';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Envelope<T> {
  messageKey?: string;
  data: T;
}

interface ErrorBody {
  statusCode?: number;
  messageKey?: string;
  message?: string;
  details?: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isEnvelope<T>(value: unknown): value is Envelope<T> {
  return isObject(value) && 'data' in value;
}

function isErrorBody(value: unknown): value is ErrorBody {
  return isObject(value) && ('messageKey' in value || 'message' in value);
}

export type Query = Record<string, string | number | boolean | string[] | undefined>;

export function toSearch(query: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else params.set(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export interface ApiClient {
  /** Endpoint que responde `{ data }`. */
  request<T>(method: Method, path: string, body?: unknown): Promise<Result<T>>;
  /** Endpoint sin cuerpo de respuesta (204). */
  send(method: Method, path: string, body?: unknown): Promise<Result<void>>;
}

export function apiClient(locals: App.Locals, fetchFn: typeof fetch = fetch): ApiClient {
  const base = (env.API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  async function call(
    method: Method,
    path: string,
    body: unknown,
  ): Promise<Result<{ status: number; json: unknown }>> {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (body !== undefined) headers['content-type'] = 'application/json';
    if (locals.sessionToken) headers.authorization = `Bearer ${locals.sessionToken}`;

    let res: Response;
    try {
      res = await fetchFn(`${base}/v1${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      return err(503, 'api.unreachable', 'No pudimos conectar con el servidor.');
    }

    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      const e = isErrorBody(json) ? json : {};
      return err(
        res.status,
        e.messageKey ?? 'api.error',
        e.message ?? 'El servidor respondió con un error.',
        e.details,
      );
    }
    return ok({ status: res.status, json });
  }

  return {
    async request<T>(method: Method, path: string, body?: unknown): Promise<Result<T>> {
      const res = await call(method, path, body);
      if (!res.ok) return res;
      if (!isEnvelope<T>(res.data.json)) {
        return err(502, 'api.bad_response', 'Respuesta inesperada del servidor.');
      }
      return ok(res.data.json.data);
    },
    async send(method: Method, path: string, body?: unknown): Promise<Result<void>> {
      const res = await call(method, path, body);
      if (!res.ok) return res;
      return ok(undefined);
    },
  };
}
