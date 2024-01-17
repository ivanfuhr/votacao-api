import { Module } from '@nestjs/common';
import { SubjectsModule } from '../subjects/subjects.module';
import { SubjectVotesController } from './subject-votes.controller';
import { SubjectVotesService } from './subject-votes.service';

@Module({
  controllers: [SubjectVotesController],
  providers: [SubjectVotesService],
  imports: [SubjectsModule],
})
export class SubjectVotesModule {}
