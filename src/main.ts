import { NestFactory } from '@nestjs/core';
import { AppModule } from './resources/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🔥 App rodando na porta ${port}!`);
}
bootstrap();
