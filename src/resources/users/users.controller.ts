import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserAdminGuard } from 'src/common/guards/user-admin.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SingupUserDto, singupUserSchema } from './schemas/singup-user.schema';
import { UpdateUserDto, updateUserSchema } from './schemas/update-user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('singup')
  @UsePipes(new ZodValidationPipe(singupUserSchema))
  async singup(@Body() body: SingupUserDto) {
    body.role = 'USER';
    const response = await this.usersService.create(body);

    return {
      name: response.name,
      email: response.email,
      document: response.document,
    };
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async findAll(@Query('page') page = 1) {
    return this.usersService.findAll({ page });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async findById(@Param('id') id: string) {
    return this.usersService.findByIdWeb(id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @UsePipes(new ZodValidationPipe(singupUserSchema))
  async create(@Body() body: SingupUserDto) {
    return this.usersService.create(body);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async update(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.update({
      data: body,
      id,
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
