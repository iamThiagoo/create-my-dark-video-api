import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { LanguageEnum, VoiceOptions } from 'src/@types';

export class createVideoDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsBoolean()
  enableNoAIStoryOption: boolean;

  @IsOptional()
  @IsBoolean()
  enableCaption: false;
  
  @IsOptional()
  @IsEnum(LanguageEnum, {
    message: 'O campo language deve ser um dos valores permitidos no enum LanguageEnum',
  })
  language?: LanguageEnum;

  @IsOptional()
  @IsString()
  voice?: VoiceOptions; 
}
