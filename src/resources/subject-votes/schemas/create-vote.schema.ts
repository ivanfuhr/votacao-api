import { z } from 'zod';

export const createVoteSchema = z.object({
  subjectId: z.string({ required_error: 'O id da pauta é obrigatório' }).uuid({
    message: 'Informe uma pauta válida',
  }),
  type: z.enum(['YES', 'NO'], {
    required_error: 'O voto é obrigatório',
  }),
});

export type CreateVoteDto = z.infer<typeof createVoteSchema>;
