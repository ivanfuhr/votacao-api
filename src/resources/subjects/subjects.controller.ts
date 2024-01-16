import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserAdminGuard } from 'src/common/guards/user-admin.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RequestUser } from 'src/types/AuthUserRequest';
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
  async findAll() {
    return this.subjectsService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(id: string) {
    return this.subjectsService.findOne(id);
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(createSubjectSchema))
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async create(@Body() body: CreateSubjectDto, @User() user: RequestUser) {
    return this.subjectsService.create({
      userId: user.id,
      ...body,
    });
  }
}
