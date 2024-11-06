import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { OpenaiService } from '../openai/openai.service';
import { HttpModule } from '@nestjs/axios';
import { ReplicateService } from '../replicate/replicate.service';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';

@Module({
  imports: [HttpModule, CacheManagerModule],
  controllers: [VideoController],
  providers: [VideoService, OpenaiService, ReplicateService],
})
export class VideoModule {}
