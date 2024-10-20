import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { createVideoDto } from './dto/create-video.dto';
import { PexelsService } from '../pexels/pexels.service';

@Injectable()
export class VideoService {

  constructor(
    private readonly openAiService: OpenaiService,
    private readonly pexelsService: PexelsService,
  ) {}

  async create(data: createVideoDto) {
    try {
      let story = data.generateStory ? await this.openAiService.createStory(data.prompt) : data.prompt
      // let images = await this.pexelsService.getImages(story, data.imagesNumber);
      let audio = await this.openAiService.textToSpeech(story);

      console.log(story)

    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
