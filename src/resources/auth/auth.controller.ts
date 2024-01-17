import { Controller, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthUserRequest } from 'src/common/types/AuthUserRequest';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { loginSchema } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthUserRequest) {
    return this.authService.login(req.user);
  }
}
