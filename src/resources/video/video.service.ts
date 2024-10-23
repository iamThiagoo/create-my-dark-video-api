import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { createVideoDto } from './dto/create-video.dto';
import { generateUniqueId } from 'src/utils/helpers';
import { ReplicateService } from '../replicate/replicate.service';
import * as fs from 'fs';

@Injectable()
export class VideoService {

  private readonly ffmpeg;

  constructor(
    private readonly openAiService: OpenaiService,
    private readonly replicateService: ReplicateService,
  ) {
    this.ffmpeg = require('fluent-ffmpeg');
  }

  async create(data: createVideoDto) {
    try {
      let uniqueId = generateUniqueId();
      let story = data.generateStory ? await this.openAiService.createStory(data.prompt) : data.prompt;
      // let audio = await this.openAiService.textToSpeech(story, uniqueId);
      // let images = await this.replicateService.getImages(story, uniqueId);

      let audio = "audios/m2mi34v7qimuxpavbm.mp3";
      let images = [
        "images/m2mi34v7qimuxpavbm/image_1.jpg",
        "images/m2mi34v7qimuxpavbm/image_2.jpg",
        "images/m2mi34v7qimuxpavbm/image_3.jpg",
        "images/m2mi34v7qimuxpavbm/image_4.jpg",
        "images/m2mi34v7qimuxpavbm/image_5.jpg",
        "images/m2mi34v7qimuxpavbm/image_6.jpg",
        "images/m2mi34v7qimuxpavbm/image_7.jpg",
        "images/m2mi34v7qimuxpavbm/image_8.jpg",
      ];
      
      const command = this.ffmpeg(audio)
      
      images.forEach((item) => {
        command.input(item);
      })

      command.output(`videos/${uniqueId}.mp4`)
      command.on("error", (err) => {
        console.log(err);
      })
      command.on("end", () => {
        console.log("File saved.");
      })
      
      command.run();

    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
