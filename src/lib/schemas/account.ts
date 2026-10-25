import { z } from 'zod';

import { passwordSchema } from './password';

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Escribe tu nombre.').max(80, 'Máximo 80 caracteres.'),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, 'Escribe tu contraseña actual.'),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirm'],
  })
  .refine((v) => v.password !== v.current, {
    message: 'La nueva contraseña debe ser distinta de la actual.',
    path: ['password'],
  });

export const tokenSchema = z.object({
  label: z.string().trim().min(1, 'Ponle un nombre al token.').max(60, 'Máximo 60 caracteres.'),
  projectId: z.string().min(1, 'Elige el proyecto.'),
});
