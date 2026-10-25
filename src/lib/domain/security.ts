// Validación de redirectTo para el login: solo rutas internas absolutas.
// Rechaza cadenas vacías, rutas externas y protocol-relative (//evil.com).
export function safeRedirectTo(target: string | null | undefined): string | null {
  if (!target) return null;
  if (!target.startsWith('/')) return null;
  if (target.startsWith('//')) return null;
  return target;
}
