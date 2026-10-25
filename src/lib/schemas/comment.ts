import { z } from 'zod';

const fraction = z.coerce.number().min(0).max(1);

/** Comentario nuevo desde el visor. El componente lo resuelve el server a partir de `elementId`. */
export const commentSchema = z.object({
  body: z.string().trim().min(1, 'Escribe el comentario.').max(2000, 'Máximo 2000 caracteres.'),
  ax: z.union([fraction, z.literal('')]).optional(),
  ay: z.union([fraction, z.literal('')]).optional(),
  elementId: z.string().optional(),
});

export const replySchema = z.object({
  commentId: z.string().min(1),
  body: z.string().trim().min(1, 'Escribe la respuesta.').max(2000, 'Máximo 2000 caracteres.'),
});

export const VERDICTS = ['approved', 'changes_requested', 'pending'] as const;
export const verdictSchema = z.object({ verdict: z.enum(VERDICTS) });
export const followUpSchema = z.object({
  commentId: z.string().min(1),
  followUp: z.enum(['resolved', 'still']),
});
