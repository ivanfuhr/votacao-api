import { BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

export function zodErrorResponse(error: ZodError) {
  const errorDetails = error.errors.map((e) => {
    return {
      path: e.path.join('.'),
      message: e.message,
    };
  });

  throw new BadRequestException(errorDetails);
}
