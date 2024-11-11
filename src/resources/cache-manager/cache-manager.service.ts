import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {
  private readonly cacheTime: number;
  private readonly requestsLimit: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.cacheTime = this.configService.get<number>('CACHE_TIME') || 86400;
    this.requestsLimit =
      this.configService.get<number>('REQUESTS_LIMIT_CACHE') || 5;
  }

  async UserCanGenerateVideo(ip: string): Promise<boolean> {
    const cacheRequests: number = await this.cacheManager.get<number>(ip) || 0;

    if (cacheRequests >= this.requestsLimit) {
      return false;
    }
  
    await this.cacheManager.set(ip, cacheRequests + 1, this.cacheTime);
    return true;
  }
}
