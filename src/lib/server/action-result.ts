import { fail } from '@sveltejs/kit';

import type { ApiError, Result } from '$lib/api/result';

/**
 * Respuesta estándar de una form action que solo informa con un toast:
 * `{ message }` si el API respondió bien, `fail(status, { error })` si no.
 */
export function toastResult<T>(result: Result<T>, message: string) {
  if (!result.ok) return apiFail(result.error);
  return { message };
}

/** Error del API como `fail(status, { error })` para el toast. */
export function apiFail(e: ApiError) {
  return fail(failStatus(e.status), { error: e.message });
}

/** `fail()` solo acepta 4xx/5xx; un status raro del API se vuelve 400. */
export function failStatus(status: number): number {
  return status >= 400 && status < 600 ? status : 400;
}

/** Texto de un campo del FormData; `''` si falta o es un archivo. */
export function field(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}

/** Todos los valores de texto de un campo repetido. */
export function fields(data: FormData, key: string): string[] {
  return data.getAll(key).filter((v): v is string => typeof v === 'string');
}
