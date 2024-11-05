import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
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
      const uniqueId = generateUniqueId();
      const story = data.generateStory ? await this.openAiService.createStory(data.prompt) : data.prompt;
      const audio = await this.openAiService.textToSpeech(story, uniqueId);
      const images = await this.replicateService.getImages(story, uniqueId);

      return new Promise(async (resolve, reject) => {
        try {
          const command = this.ffmpeg(audio);
          const audioDurationInSeconds: any = await this.getAudioDuration(audio);
          const imageDuration = audioDurationInSeconds / images.length;

          images.forEach((item) => {
            command
              .input(item)
              .inputOptions(['-loop 1'])
              .inputOptions([`-t ${imageDuration}`]);
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

          command.on('error', (err) => {
            console.error('Error during video creation:', err);
            reject(new HttpException('Error processing video', HttpStatus.INTERNAL_SERVER_ERROR));
          });

          command.on('end', async () => {
            try {
              console.log('Video processing completed');
              if (!fs.existsSync(`videos/${uniqueId}.mp4`)) {
                throw new Error('Video file not found after processing');
              }

              const videoStream = fs.createReadStream(`videos/${uniqueId}.mp4`);
              const streamableFile = new StreamableFile(videoStream, {
                type: 'video/mp4',
                disposition: `attachment; filename="${uniqueId}.mp4"`,
              });

              resolve(streamableFile);
            } catch (error) {
              console.error('Error creating video stream:', error);
              reject(new HttpException('Error creating video stream', HttpStatus.INTERNAL_SERVER_ERROR));
            }
          });

          await command.run();
        } catch (error) {
          console.error('Error in video processing:', error);
          reject(new HttpException('Error processing video', HttpStatus.INTERNAL_SERVER_ERROR));
        }
      });

    } catch (error) {
      console.error('Error in create method:', error);
      throw new HttpException(
        error.message || 'Bad Request',
        error.status || HttpStatus.BAD_REQUEST
      );
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
