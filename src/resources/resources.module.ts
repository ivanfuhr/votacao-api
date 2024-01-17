import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SubjectCategoriesModule } from './subject-categories/subject-categories.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, SubjectsModule, SubjectCategoriesModule],
})
export class ResourcesModule {}
