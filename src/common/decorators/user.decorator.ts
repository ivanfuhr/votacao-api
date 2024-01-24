import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserRequest } from 'src/common/types/AuthUserRequest';

export const User = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<AuthUserRequest>();
  if (!request.user) return null;

  return request.user;
});
