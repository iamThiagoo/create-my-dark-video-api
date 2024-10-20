import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { OpenaiService } from '../openai/openai.service';
import { HttpModule } from '@nestjs/axios';
import { PexelsService } from '../pexels/pexels.service';

@Module({
  imports: [HttpModule],
  controllers: [VideoController],
  providers: [VideoService, OpenaiService, PexelsService],
})
export class VideoModule {}
