import {
  IsBoolean,
  IsString,
} from 'class-validator';

export class createVideoDto {
  @IsString()
  prompt: string;

  @IsBoolean()
  generateStory: boolean;
}
