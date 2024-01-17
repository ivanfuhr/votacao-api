import { Module } from '@nestjs/common';
import { SubjectCategoriesModule } from '../subject-categories/subject-categories.module';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [SubjectCategoriesModule],
})
export class SubjectsModule {}
