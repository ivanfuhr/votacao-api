import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  @UseGuards(JwtAuthGuard)
  async findAll(@User() user: RequestUser) {
    return this.subjectsService.findAll({
      userId: user.id,
    });
  }

  @Get('/my-votes')
  @UseGuards(JwtAuthGuard)
  async myVotes(@User() user: RequestUser) {
    return this.subjectsService.myVotes({ userId: user.id });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @User() user: RequestUser) {
    return this.subjectsService.findOne({ id, userId: user.id });
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createSubjectSchema))
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async create(@Body() body: CreateSubjectDto) {
    return this.subjectsService.create({
      data: body,
    });
  }
}
