import { Module } from '@nestjs/common';
import { PexelsService } from './pexels.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PexelsService],
  exports: [PexelsService]
})
export class PexelsModule {}
