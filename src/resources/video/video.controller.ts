import { Controller, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';
import { createVideoDto } from './dto/create-video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() createVideoDto: createVideoDto) {
    return this.videoService.create(createVideoDto);
  }
}
