import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { createVideoDto } from './dto/create-video.dto';
import { PexelsService } from '../pexels/pexels.service';
import { generateUniqueId } from 'src/utils/helpers';

@Injectable()
export class VideoService {

  constructor(
    private readonly openAiService: OpenaiService,
    private readonly pexelsService: PexelsService,
  ) {}

  async create(data: createVideoDto) {
    try {
      let uniqueId = generateUniqueId();
      let story = data.generateStory ? await this.openAiService.createStory(data.prompt) : data.prompt
      let images = await this.pexelsService.getImages(story, uniqueId);
      let audio = await this.openAiService.textToSpeech(story, uniqueId);

    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
