import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { RequestUser } from 'src/types/AuthUserRequest';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'document',
    });
  }

  async validate(document: string, password: string): Promise<RequestUser> {
    const user = await this.authService.validateUser(document, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
