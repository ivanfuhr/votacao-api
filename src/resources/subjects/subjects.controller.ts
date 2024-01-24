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
import { User } from 'src/common/decorators/user.decorator';
import { UserAdminGuard } from 'src/common/guards/user-admin.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RequestUser } from 'src/common/types/AuthUserRequest';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateSubjectDto,
  createSubjectSchema,
} from './schemas/create-subject.schema';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get('/')
  async findAll(
    @User() user?: RequestUser,
    @Query('page') page = 1,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.subjectsService.findAllActive({
      page,
      userId: user?.id,
      categoryId,
    });
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async findAllAdmin(@Query('page') page = 1) {
    return this.subjectsService.findAll({ page });
  }

  @Get('/my-votes')
  @UseGuards(JwtAuthGuard)
  async myVotes(@User() user: RequestUser, @Query('page') page = 1) {
    return this.subjectsService.findByUserVotes({ userId: user.id, page });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @User() user?: RequestUser) {
    return this.subjectsService.findOne({ id, userId: user?.id });
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createSubjectSchema))
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async create(@Body() body: CreateSubjectDto) {
    return this.subjectsService.create({
      data: body,
    });
  }

  @Put('/:id')
  @UsePipes(new ZodValidationPipe(createSubjectSchema))
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async update(@Param('id') id: string, @Body() body: CreateSubjectDto) {
    return this.subjectsService.update({
      id,
      data: body,
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async delete(@Param('id') id: string) {
    return this.subjectsService.delete({ id });
  }
}
