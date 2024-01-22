import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { SingupUserDto, singupUserSchema } from './schemas/singup-user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('singup')
  @UsePipes(new ZodValidationPipe(singupUserSchema))
  async singup(@Body() body: SingupUserDto) {
    const response = await this.usersService.create(body);

    return {
      name: response.name,
      email: response.email,
      document: response.document,
    };
  }
}
