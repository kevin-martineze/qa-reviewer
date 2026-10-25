import { z } from 'zod';

import { avatarSchema } from './avatar';

export const PASSWORD_MIN = 12;

export const passwordSchema = z.string().min(PASSWORD_MIN, 'Mínimo 12 caracteres.');

export const passwordFormSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirm'],
  });

export const inviteSchema = passwordFormSchema.extend({
  name: z.string().trim().min(1, 'Escribe tu nombre.'),
  avatar: avatarSchema,
});

export type PasswordFormSchema = typeof passwordFormSchema;
export type InviteSchema = typeof inviteSchema;
