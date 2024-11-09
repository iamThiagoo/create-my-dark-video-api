import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import Replicate from 'replicate';
import { getStoryChunks } from 'src/utils/helpers';
import { pipeline } from 'stream';
import { promisify } from 'util';

@Injectable()
export class ReplicateService {
  private readonly apiKey: string;
  private readonly replicate: Replicate;
  private readonly replicateModel:
    | `${string}/${string}`
    | `${string}/${string}:${string}`;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('REPLICATE_KEY');
    this.replicate = new Replicate({ auth: this.apiKey });
    this.replicateModel = this.configService.get<
      `${string}/${string}` | `${string}/${string}:${string}`
    >('REPLICATE_MODEL');
  }

  async getImages(story: string, uniqueId: string) {
    try {
      const keywords = getStoryChunks(story);
      const imageDir = `output/images/${uniqueId}`;
      mkdirSync(imageDir, { recursive: true });
      const imagesNameArray = [];

      await Promise.all(
        keywords.map(async (keyword, index) => {
          const input = {
            prompt: `${keyword}`,
          };

          const filename = `image_${index + 1}.jpg`;
          const output = await this.replicate.run(this.replicateModel, {
            input,
          });
          const imageUrl = output[0];
          const response = await fetch(imageUrl);
          const readableStream = response.body;

          await this.saveImageFromStream(
            readableStream,
            join(imageDir, filename),
          );
          imagesNameArray.push(join(imageDir, filename));
        }),
      );

      return imagesNameArray;
    } catch (error) {
      console.error('Error getting Replicate images:', error);
      throw new Error('Failed to get Replicate images');
    }
  }

  async saveImageFromStream(stream: ReadableStream, filename: string) {
    const pipelineAsync = promisify(pipeline);
    const writeStream = createWriteStream(filename);
    await pipelineAsync(stream, writeStream);
  }
}
