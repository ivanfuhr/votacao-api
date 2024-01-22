import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { zodErrorResponse } from 'src/common/helpers/zod-error-response';
import { RequestUser } from 'src/common/types/AuthUserRequest';
import { ZodError } from 'zod';
import { UsersService } from '../users/users.service';
import { loginSchema } from './schemas/login.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    document: string,
    password: string,
  ): Promise<RequestUser | null> {
    await this.parseData({ document, password });

    const user = await this.usersService.findByDocument(document);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { id, document, email, name, role } = user;

      return {
        id,
        name,
        email,
        document,
        role,
      };
    }

    return null;
  }

  async login(user: RequestUser) {
    const payload = { username: user.name, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async revalidade(user: RequestUser) {
    const payload = { username: user.name, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async parseData(request: { document: string; password: string }) {
    try {
      loginSchema.parse(request);
    } catch (error) {
      if (error instanceof ZodError) {
        zodErrorResponse(error);
      }

      throw new BadRequestException('Erro desconhecido durante a validação');
    }
  }
}
