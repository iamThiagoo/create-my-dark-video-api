import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
