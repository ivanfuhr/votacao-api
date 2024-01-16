import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') return value;

    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => e.message);

        const combinedErrorMessage = errorMessages.join(', ');

        throw new BadRequestException(
          combinedErrorMessage !== 'Invalid input'
            ? combinedErrorMessage
            : 'A validação falhou',
        );
      }

      throw new BadRequestException('Erro desconhecido durante a validação');
    }
  }
}
