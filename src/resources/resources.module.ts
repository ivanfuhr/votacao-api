import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [UsersModule, AuthModule, SubjectsModule],
})
export class ResourcesModule {}
