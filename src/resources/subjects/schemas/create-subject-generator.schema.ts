import { z } from 'zod';

export const createSubjectGeneratorSchema = z.object({
  title: z.string().describe('Um título criativo relacionado a pauta').min(2),
  description: z.string().describe('Descrição com detalhes da pauta').min(50),
});

export type CreateSubjectGeneratorDto = z.infer<
  typeof createSubjectGeneratorSchema
>;
