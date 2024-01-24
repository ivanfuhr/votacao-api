import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserAdminGuard } from 'src/common/guards/user-admin.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateSubjectCategoryDto,
  createSubjectCategorySchema,
} from './schemas/create-subject-category.schema';
import { SubjectCategoriesService } from './subject-categories.service';

@Controller('subject-categories')
export class SubjectCategoriesController {
  constructor(
    private readonly subjectCategoriesService: SubjectCategoriesService,
  ) {}

  @Post('/')
  @UsePipes(new ZodValidationPipe(createSubjectCategorySchema))
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  create(@Body() body: CreateSubjectCategoryDto) {
    return this.subjectCategoriesService.create({
      data: body,
    });
  }

  @Put('/:id')
  @UsePipes(new ZodValidationPipe(createSubjectCategorySchema))
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  update(@Param('id') id: string, @Body() body: CreateSubjectCategoryDto) {
    return this.subjectCategoriesService.update({
      id,
      data: body,
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  delete(@Param('id') id: string) {
    return this.subjectCategoriesService.delete(id);
  }

  @Get('/')
  findAll() {
    return this.subjectCategoriesService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.subjectCategoriesService.findOne(id);
  }
}
