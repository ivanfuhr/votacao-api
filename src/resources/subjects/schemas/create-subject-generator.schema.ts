import { z } from 'zod';

export const createSubjectGeneratorSchema = z.object({
  title: z.string().describe('Título da pauta').min(2).max(120),
  description: z.string().describe('Descrição da pauta'),
});

export type CreateSubjectGeneratorDto = z.infer<
  typeof createSubjectGeneratorSchema
>;
