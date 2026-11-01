// Códigos del login por navegador de la skill (device flow, RFC 8628).
// La persona ve y escribe el código como `ABCD-EFGH`; se acepta en minúsculas, con o sin guion.

/** Letras y números sin los que se confunden (0/O, 1/I). */
export const USER_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const USER_CODE_LENGTH = 8;

/** `abcd efgh` o `ABCDEFGH` → `ABCD-EFGH`. `null` si no tiene la forma de un código. */
export function normalizeUserCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const chars = input.toUpperCase().replace(/[\s-]/g, '');
  if (chars.length !== USER_CODE_LENGTH) return null;
  for (const c of chars) if (!USER_CODE_ALPHABET.includes(c)) return null;
  return `${chars.slice(0, 4)}-${chars.slice(4)}`;
}

/** Etiqueta del token que crea la aprobación: identifica el equipo en Cuenta → Tokens. */
export function defaultDeviceLabel(hostname: string): string {
  const host = hostname.trim();
  return (host ? `Claude Code · ${host}` : 'Claude Code').slice(0, 60);
}
