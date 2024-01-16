import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RequestUser } from 'src/types/AuthUserRequest';
import { UsersService } from '../users/users.service';

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
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
