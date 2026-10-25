import { z } from 'zod';

import { AVATAR_IDS } from '$lib/domain/avatars';

/** Campo `avatar` de los formularios: un id del banco, o vacío para usar las iniciales. */
export const avatarSchema = z
  .union([z.enum(AVATAR_IDS, 'Elige un avatar del banco.'), z.literal('')])
  .optional()
  .transform((v) => v || null);
