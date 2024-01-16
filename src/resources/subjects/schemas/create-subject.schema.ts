import { z } from 'zod';

export const createSubjectSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'O título deve ter pelo menos 2 caracteres',
    })
    .max(255, {
      message: 'O título deve ter no máximo 255 caracteres',
    }),
  description: z.string(),
  timeToEnd: z
    .number()
    .positive({
      message: 'O tempo para terminar deve ser um número positivo',
    })
    .default(60),
  startAt: z.coerce
    .date()
    .refine((date) => {
      const now = new Date();
      return date > now;
    }, 'A data de início deve ser maior que a data atual')
    .default(() => new Date()),
});

export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
