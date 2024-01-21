import { Module } from '@nestjs/common';
import { LangchainService } from 'src/common/services/langchain.service';
import { SubjectCategoriesModule } from '../subject-categories/subject-categories.module';
import { SubjectsController } from './subjects.controller';
import { SubjectsGenerator } from './subjects.generator';
import { SubjectsService } from './subjects.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectsGenerator, LangchainService],
  imports: [SubjectCategoriesModule],
  exports: [SubjectsService],
})
export class SubjectsModule {}
