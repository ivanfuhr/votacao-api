import { z } from 'zod';

export const createSubjectSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(2, {
      message: 'O título deve ter pelo menos 2 caracteres',
    })
    .max(255, {
      message: 'O título deve ter no máximo 255 caracteres',
    }),
  description: z.string({ required_error: 'A descrição é obrigatória' }),
  timeToEnd: z
    .number({ required_error: 'O tempo para terminar é obrigatório' })
    .positive({
      message: 'O tempo para terminar deve ser um número positivo',
    })
    .default(60),
  categoryId: z.string({ required_error: 'A categoria é obrigatória' }).uuid({
    message: 'Informe uma categoria válida',
  }),
  startAt: z.coerce
    .date({ required_error: 'A data de início é obrigatória' })
    .refine((date) => {
      const now = new Date();
      return date > now;
    }, 'A data de início deve ser maior que a data atual')
    .default(() => new Date()),
});

export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
