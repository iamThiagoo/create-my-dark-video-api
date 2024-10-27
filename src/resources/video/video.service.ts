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
      let audio = await this.openAiService.textToSpeech(story, uniqueId);
      let images = await this.replicateService.getImages(story, uniqueId);

      const command = this.ffmpeg(audio);
      const audioDurationInSeconds : any = await this.getAudioDuration(audio);
      const imageDuration = audioDurationInSeconds / images.length;

      images.forEach((item, index) => {
        command
          .input(item)
          .inputOptions([`-loop 1`])
          .inputOptions([`-t ${imageDuration}`])
      });

      const filterComplex = images
        .map((_, index) => `[${index + 1}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v${index}];`)
        .join('');

      const streamReferences = images
        .map((_, index) => `[v${index}]`)
        .join('');

      command
        .complexFilter(`${filterComplex}${streamReferences}concat=n=${images.length}:v=1:a=0[outv]`)
        .outputOptions([
          '-map [outv]',
          '-map 0:a',
          '-c:v libx264',
          '-c:a copy',
          '-shortest'
        ])
        .output(`videos/${uniqueId}.mp4`);

      command.on("error", (err) => {
        console.log(err);
      });

      command.on("end", () => {
        console.log("File saved.");
      });

      command.run();

    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
      this.ffmpeg.ffprobe(audioPath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        const duration = metadata.format.duration;
        resolve(duration);
      });
    });
  }
}
