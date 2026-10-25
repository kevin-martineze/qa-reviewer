export interface ApiError {
  status: number;
  messageKey: string;
  message: string;
  details?: unknown;
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T>(
  status: number,
  messageKey: string,
  message: string,
  details?: unknown,
): Result<T> {
  return { ok: false, error: { status, messageKey, message, details } };
}
