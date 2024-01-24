import { FormatCpf } from 'src/common/helpers/format-cpf';
import { ValidadeCpf } from 'src/common/helpers/validade-cpf';
import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres',
    })
    .max(255, {
      message: 'O nome deve ter no máximo 255 caracteres',
    }),

  email: z
    .string({ required_error: 'O email é obrigatório' })
    .email({
      message: 'O email deve ser um email válido',
    })
    .min(2, {
      message: 'O email deve ter pelo menos 2 caracteres',
    })
    .max(255, {
      message: 'O email deve ter no máximo 255 caracteres',
    }),

  password: z.string({ required_error: 'A senha é obrigatória' }).optional(),

  document: z
    .string({ required_error: 'O CPF é obrigatório' })
    .refine(ValidadeCpf, {
      message: 'O CPF deve ser válido',
    })
    .transform(FormatCpf),

  role: z.enum(['ADMIN', 'USER']).default('USER'),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
