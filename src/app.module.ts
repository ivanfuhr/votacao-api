import { Module } from '@nestjs/common';
import { ConfigsModule } from './config/configs.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [ConfigsModule, ResourcesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
