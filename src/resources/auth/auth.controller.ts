import {
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthUserRequest } from 'src/common/types/AuthUserRequest';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { loginSchema } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
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
