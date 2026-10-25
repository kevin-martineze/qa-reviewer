/** Resultado de una form action para el toast: `{ message }` si salió bien, `{ error }` si no. */
export interface FormFeedback {
  kind: 'success' | 'error';
  text: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function formFeedback(form: unknown): FormFeedback | null {
  if (!isRecord(form)) return null;
  // Errores por campo se muestran junto al campo, no en un toast.
  if (typeof form.error === 'string') return { kind: 'error', text: form.error };
  if (typeof form.message === 'string') return { kind: 'success', text: form.message };
  return null;
}
