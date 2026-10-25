import { describe, expect, it } from 'vitest';

import { isAvatarId } from '$lib/domain/avatars';

import { profileSchema } from './account';

describe('avatar en el perfil', () => {
  it('acepta un id del banco', () => {
    expect(profileSchema.parse({ name: 'Ana', avatar: 'a07' }).avatar).toBe('a07');
  });

  it('vacío o ausente vuelve null (iniciales)', () => {
    expect(profileSchema.parse({ name: 'Ana', avatar: '' }).avatar).toBeNull();
    expect(profileSchema.parse({ name: 'Ana' }).avatar).toBeNull();
  });

  it('rechaza ids que no están en el banco', () => {
    expect(profileSchema.safeParse({ name: 'Ana', avatar: 'a99' }).success).toBe(false);
    expect(profileSchema.safeParse({ name: 'Ana', avatar: '../x' }).success).toBe(false);
  });

  it('isAvatarId filtra lo que llega del contrato', () => {
    expect(isAvatarId('a01')).toBe(true);
    expect(isAvatarId('https://x/y.png')).toBe(false);
    expect(isAvatarId(null)).toBe(false);
  });
});
