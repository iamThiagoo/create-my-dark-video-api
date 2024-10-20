import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'pexels';

@Injectable()
export class PexelsService {

  private readonly apiKey : string;
  private readonly pexels;

  constructor(
    private readonly configService : ConfigService
  ) {
    this.apiKey = this.configService.get<string>('PEXELS_KEY');
    this.pexels = createClient(this.apiKey);
  }

  async getImages(story, uniqueId) {
    try {
      const keywords = this.extractKeywords(story);
      const images = [];
      
      const imagePromises = keywords.map(async (keyword, index) => {
        const response = await this.pexels.photos.search({ query: keyword, per_page: 1, orientation: 'portrait' });  
        if (response.photos.length > 0) {
          images[index] = {
            id: uniqueId,
            src: response.photos[0].src.medium,
            keyword: keyword,
          };
        }
      });
  
      await Promise.all(imagePromises);
      const filteredImages = images.filter(image => image !== undefined);
      
      return filteredImages
      
    } catch (error) {
      console.error('Error getting Pexels images:', error);
      throw new Error('Failed to get Pexels images');
    }
  }

  extractKeywords(text) {
    const sentences = text.split(/[\.\,]+/).map(sentence => sentence.trim()).filter(Boolean);
    const keywords = sentences.filter(sentence => sentence.length >= 25);
    return keywords;
  }
}
