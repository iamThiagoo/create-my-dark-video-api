import { Module } from '@nestjs/common';
import { TestController } from './test/test.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { VideoModule } from './video/video.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PexelsModule } from './pexels/pexels.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VideoModule,
    OpenaiModule,
    HttpModule,
    PexelsModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
