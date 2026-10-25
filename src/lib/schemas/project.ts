import { z } from 'zod';

export const ASSIGNMENT_STRATEGIES = ['manual', 'round_robin', 'by_module'] as const;
export const SLA_MIN = 1;
export const SLA_MAX = 15;

/** Una entrada por línea; ignora líneas vacías y repetidas. */
export function lines(text: string): string[] {
  return [
    ...new Set(
      text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
    ),
  ];
}

export const projectGeneralSchema = z.object({
  name: z.string().trim().min(1, 'Escribe el nombre.').max(80, 'Máximo 80 caracteres.'),
});

export const slaSchema = z.object({
  slaDays: z.coerce
    .number('Escribe un número.')
    .int('Solo días completos.')
    .min(SLA_MIN, `Mínimo ${SLA_MIN} día.`)
    .max(SLA_MAX, `Máximo ${SLA_MAX} días.`),
});

export const moduleRuleSchema = z.object({
  pattern: z
    .string()
    .trim()
    .regex(/^\/\S*$/, 'La ruta empieza con / y no lleva espacios.'),
  userId: z.string().min(1, 'Elige un diseñador.'),
});

export const assignmentSchema = z
  .object({
    strategy: z.enum(ASSIGNMENT_STRATEGIES, 'Elige una estrategia.'),
    moduleRules: z.array(moduleRuleSchema),
  })
  .refine((v) => v.strategy !== 'by_module' || v.moduleRules.length > 0, {
    message: 'Agrega al menos una regla por módulo.',
    path: ['moduleRules'],
  })
  .refine((v) => new Set(v.moduleRules.map((r) => r.pattern)).size === v.moduleRules.length, {
    message: 'Hay rutas repetidas.',
    path: ['moduleRules'],
  });

export const integrationsSchema = z.object({
  checkName: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'Solo minúsculas, números y guiones.'),
  commentOnPr: z.boolean(),
  commentOnCard: z.boolean(),
});

export const rulesSchema = z.object({
  designRules: z.array(z.string().max(200, 'Cada regla tiene máximo 200 caracteres.')).max(30),
  maskSelectors: z
    .array(z.string().max(120, 'Cada selector tiene máximo 120 caracteres.'))
    .max(30, 'Máximo 30 selectores.'),
});
