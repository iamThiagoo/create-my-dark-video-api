import { Injectable } from '@nestjs/common';

@Injectable()
export class PexelsService {

  async getImages(story: string, imagesNumber: number) {
    console.log('oiii')
    console.log(story, imagesNumber)
  }

}
