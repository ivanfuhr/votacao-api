import { Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthUserRequest } from 'src/common/types/AuthUserRequest';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthUserRequest) {
    return {
      access_token: await this.authService.login(req.user),
      user: {
        name: req.user.name,
        email: req.user.email,
        document: req.user.document,
      },
    };
  }

  @Patch('revalidate')
  @UseGuards(JwtAuthGuard)
  async validate(@Request() req: AuthUserRequest) {
    return {
      access_token: await this.authService.revalidade(req.user),
      user: {
        name: req.user.name,
        email: req.user.email,
        document: req.user.document,
      },
    };
  }
}
