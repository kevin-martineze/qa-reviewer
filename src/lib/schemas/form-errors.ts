import type { z } from 'zod';

export type FieldErrors = Record<string, string>;

/** Primer mensaje por campo, para pintar debajo de cada input. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Lee los campos de texto de un FormData como objeto plano para zod. */
export function formObject(data: FormData, keys: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = data.get(key);
    out[key] = typeof value === 'string' ? value : '';
  }
  return out;
}
