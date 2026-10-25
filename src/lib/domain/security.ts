// Validación de redirectTo para el login: solo rutas internas absolutas.
// Rechaza vacío, URLs externas, protocol-relative (`//evil.com`) y la variante con
// barra invertida (`/\evil.com`), que los navegadores interpretan como `//`.
export function safeRedirectTo(target: string | null | undefined): string | null {
  if (!target) return null;
  if (!target.startsWith('/')) return null;
  if (target.startsWith('//') || target.startsWith('/\\')) return null;
  if (/[\r\n\t]/.test(target)) return null;
  return target;
}
