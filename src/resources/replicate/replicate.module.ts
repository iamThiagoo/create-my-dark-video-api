import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReplicateService } from './replicate.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ReplicateService],
  exports: [ReplicateService]
})
export class ReplicateModule {}
