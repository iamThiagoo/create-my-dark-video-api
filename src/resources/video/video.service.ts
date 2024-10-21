import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { createVideoDto } from './dto/create-video.dto';
import { generateUniqueId } from 'src/utils/helpers';
import { ReplicateService } from '../replicate/replicate.service';

@Injectable()
export class VideoService {

  constructor(
    private readonly openAiService: OpenaiService,
    private readonly replicateService: ReplicateService,
  ) {}

  async create(data: createVideoDto) {
    try {
      let uniqueId = generateUniqueId();
      
      let story = data.generateStory ? await this.openAiService.createStory(data.prompt) : data.prompt;
      let audio = await this.openAiService.textToSpeech(story, uniqueId);
      let images = await this.replicateService.getImages(story, uniqueId);

    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
