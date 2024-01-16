import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [
    // Prisma
    PrismaModule,

    // Env
    ConfigModule.forRoot(),
  ],
  exports: [ConfigModule],
})
export class ConfigsModule {}
