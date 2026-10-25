import { z } from 'zod';

export const emailSchema = z.string().trim().toLowerCase().email('Escribe un correo válido.');

/** Login: sin mínimo de largo; la contraseña la valida el API. */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Escribe tu contraseña.'),
});

export const recoverRequestSchema = z.object({ email: emailSchema });
