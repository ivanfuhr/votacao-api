import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SubjectCategoriesModule } from './subject-categories/subject-categories.module';
import { SubjectVotesModule } from './subject-votes/subject-votes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SubjectsModule,
    SubjectCategoriesModule,
    SubjectVotesModule,
  ],
})
export class ResourcesModule {}
