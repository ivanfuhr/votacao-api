import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
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
  create(@Body() body: CreateSubjectCategoryDto) {
    return this.subjectCategoriesService.create({
      data: body,
    });
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
