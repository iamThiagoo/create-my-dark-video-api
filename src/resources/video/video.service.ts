import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { createVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {

  constructor(
    private readonly openAiService: OpenaiService
  ) {}

  async create(data: createVideoDto) {
    try {
      let story = data.generateStory ? await this.openAiService.createStory(data.prompt) : data.prompt
      // let images = await this.openAiService.createImages(story, data.imagesNumber); // FIX

      console.log(story)

    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
