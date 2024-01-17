import { Module } from '@nestjs/common';
import { SubjectCategoriesController } from './subject-categories.controller';
import { SubjectCategoriesService } from './subject-categories.service';

@Module({
  controllers: [SubjectCategoriesController],
  providers: [SubjectCategoriesService],
  exports: [SubjectCategoriesService],
})
export class SubjectCategoriesModule {}
