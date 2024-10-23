import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
