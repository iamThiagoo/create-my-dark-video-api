import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

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

  async createImages(prompt: string, imagesNumber: number = 1): Promise<string[]> {
    try {
      const finalPrompt: string = `Crie uma sequência de imagens que ilustrem a história contada a seguir, retornando cada imagem na ordem em que aparecem no texto. A história é: ${prompt}`;
      const response = await this.openai.images.generate({
        prompt: finalPrompt,
        model: "dall-e-2",
        n: imagesNumber,
        size: '1024x1024',
      });
  
      return response.data.map((img) => img.url);
    } catch (error) {
      console.error('Error generating images:', error);
      throw new Error('Failed to generate images');
    }
  }

  async createStory(prompt: string): Promise<string> {
    try {
      const finalPrompt: string = `Crie uma história envolvente e emocionante que seja perfeita para um vídeo de até 30 segundos sobre: ${prompt}.A história deve ter um início cativante, um desenvolvimento intrigante e um desfecho surpreendente. Utilize descrições vívidas e emoções para capturar a atenção do espectador.`;
      
      console.log(finalPrompt.length)
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
}
