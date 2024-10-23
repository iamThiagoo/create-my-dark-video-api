import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class createVideoDto {
  @IsString()
  prompt: string;

  @IsBoolean()
  generateStory: boolean;

  @IsOptional()
  @IsNumber()
  @Max(5) // Infelizmente, tudo tem um limite :(
  imagesNumber: number;
}
