import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [
    // Prisma
    PrismaModule,

    // Env
    ConfigModule.forRoot(),

    // JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECERT'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    // Scheluder
    ScheduleModule.forRoot(),
  ],
  exports: [JwtModule, ConfigModule],
})
export class ConfigsModule {}
