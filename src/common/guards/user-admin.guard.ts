import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserRequest } from 'src/types/AuthUserRequest';

@Injectable()
export class UserAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<AuthUserRequest>().user;
    if (!user) throw new UnauthorizedException();

    return user.role === 'ADMIN';
  }
}
