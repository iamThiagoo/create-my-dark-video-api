import { Controller, Post, Body, Ip } from '@nestjs/common';
import { VideoService } from './video.service';
import { createVideoDto } from './dto/create-video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() createVideoDto: createVideoDto, @Ip() ip: string) {
    return this.videoService.create(createVideoDto, ip);
  }
}
