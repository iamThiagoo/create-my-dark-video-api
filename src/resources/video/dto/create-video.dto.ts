import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { VoiceOptions } from 'src/@types';

export class createVideoDto {
  @IsString()
  prompt: string;

  @IsBoolean()
  generateStory: boolean;

  @IsOptional()
  @IsString()
  voice: VoiceOptions; 
}
