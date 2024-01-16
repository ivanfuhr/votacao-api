import { FormatCpf } from 'src/common/helpers/format-cpf';
import { ValidadeCpf } from 'src/common/helpers/validade-cpf';
import { z } from 'zod';

export const loginSchema = z.object({
  document: z
    .string()
    .refine(ValidadeCpf, {
      message: 'O CPF deve ser válido',
    })
    .transform(FormatCpf),
  password: z
    .string()
    .min(8, {
      message: 'A senha deve ter pelo menos 8 caracteres',
    })
    .max(255, {
      message: 'A senha deve ter no máximo 255 caracteres',
    }),
});

export type LoginSchemaDto = z.infer<typeof loginSchema>;
