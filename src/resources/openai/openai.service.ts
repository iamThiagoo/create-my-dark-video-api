import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from "fs";

@Injectable()
export class OpenaiService {

  private readonly apiKey : string;
  private readonly openai : OpenAI

  constructor(
    private readonly configService : ConfigService
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_KEY');
    this.openai = new OpenAI({apiKey: this.apiKey});
  }

  async createStory(prompt: string): Promise<string> {
    try {
      const finalPrompt: string = `Crie uma história envolvente e emocionante que seja perfeita para um vídeo de até 30 segundos sobre: ${prompt}.A história deve ter um início cativante, um desenvolvimento intrigante e um desfecho surpreendente. Utilize descrições vívidas e emoções para capturar a atenção do espectador.`;
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: finalPrompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      });
    
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating video story:', error);
      throw new Error('Failed to generate story');
    }
  }

  async textToSpeech(prompt: string, uniqueId: string) : Promise<string> {
    try {
      const speechFile = path.resolve(`./audios/${uniqueId}.mp3`);

      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: prompt,       
      });
    
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
      return speechFile;

    } catch (error) {
      console.error('Error generating audio story:', error);
      throw new Error('Failed to generate audi');
    }
  }

  // async createImages(prompt: string, uniqueId : string) {
  //   try {
  //     let images = [];
  //     const keywords = this.extractKeywords(prompt);

  //     const imagePromises = keywords.map(async (keyword) => {
  //       const response = await this.openai.images.generate({
  //         model: "dall-e-3",
  //         prompt: keyword,
  //         size: "1024x1024",
  //         quality: "standard",
  //         n: 1,
  //       });
  
  //       if (response.data && response.data.length > 0) {
  //         images.push(response.data[0].url);
  //       }
  //     });

  //     await Promise.all(imagePromises);
  //     console.log(images)
    
  //     return images;

  //   } catch (error) {
  //     console.error('Error generating audio story:', error);
  //     throw new Error('Failed to generate audi');
  //   }
  // }

  // extractKeywords(text) {
  //   const sentences = text.split(/[\.\,]+/).map(sentence => sentence.trim()).filter(Boolean);
  //   const keywords = sentences.filter(sentence => sentence.length >= 20);
  //   return keywords;
  // }
}
