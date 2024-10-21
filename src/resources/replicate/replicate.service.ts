import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Replicate from 'replicate';

@Injectable()
export class ReplicateService {

  private readonly apiKey : string;
  private readonly replicate;

  constructor(
    private readonly configService : ConfigService
  ) {
    this.apiKey = this.configService.get<string>('REPLICATE_KEY');
    this.replicate = new Replicate({auth: this.configService.get<string>('OPENAI_KEY')});
  }

  async getImages(story, uniqueId) {
    try {
      // TO-DO
      const keywords = this.extractKeywords(story);

    } catch (error) {
      console.error('Error getting Replicate images:', error);
      throw new Error('Failed to get Replicate images');
    }
  }

  extractKeywords(text) {
    const sentences = text.split(/[\.\,]+/).map(sentence => sentence.trim()).filter(Boolean);
    const keywords = sentences.filter(sentence => sentence.length >= 25);
    return keywords;
  }
}
