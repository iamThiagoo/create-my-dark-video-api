import { Module } from '@nestjs/common';
import { TestController } from './test/test.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { VideoModule } from './video/video.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ReplicateModule } from './replicate/replicate.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { CsrfModule } from './csrf/csrf.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VideoModule,
    OpenaiModule,
    HttpModule,
    ReplicateModule,
    CacheManagerModule,
    CsrfModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
