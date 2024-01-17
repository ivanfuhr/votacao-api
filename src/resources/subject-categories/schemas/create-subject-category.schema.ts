import { z } from 'zod';

export const createSubjectCategorySchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(2, {
      message: 'O título deve ter pelo menos 2 caracteres',
    })
    .max(255, {
      message: 'O título deve ter no máximo 255 caracteres',
    }),
});

export type CreateSubjectCategoryDto = z.infer<
  typeof createSubjectCategorySchema
>;
