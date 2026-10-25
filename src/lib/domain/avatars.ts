// Banco de avatares por defecto (static/avatars/<id>.webp, 256 px, ilustrados con Gemini).
// El API guarda solo el id; la imagen la sirve el front. Sin avatar se muestran las iniciales.
export const AVATAR_IDS = [
  'a01',
  'a02',
  'a03',
  'a04',
  'a05',
  'a06',
  'a07',
  'a08',
  'a09',
  'a10',
  'a11',
  'a12',
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

/** Texto alternativo del selector: describe la ilustración, no a la persona. */
export const AVATAR_LABEL: Record<AvatarId, string> = {
  a01: 'Hombre de barba corta con buzo gris',
  a02: 'Mujer de cabello ondulado con gafas',
  a03: 'Hombre de cabello rizado con suéter azul',
  a04: 'Mujer de moño con camisa celeste',
  a05: 'Hombre de barba con camisa verde',
  a06: 'Mujer pelirroja con suéter mostaza',
  a07: 'Mujer de cola de caballo con blazer',
  a08: 'Hombre de cabello gris con gafas',
  a09: 'Mujer de cabello rizado con blusa coral',
  a10: 'Hombre joven con gafas y chaqueta de jean',
  a11: 'Mujer con hiyab verde',
  a12: 'Persona de cabello platinado con cuello alto',
};

/** El contrato trae `string | null`: un id que el front no conoce cae a las iniciales. */
export function isAvatarId(value: string | null | undefined): value is AvatarId {
  return AVATAR_IDS.some((id) => id === value);
}
