import { NestFactory } from '@nestjs/core';
import { AppModule } from './resources/app.module';
import cookieParser from 'cookie-parser';
import { CsrfMiddleware } from './middleware/csrf.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.APP_URL,
    credentials: true,
  });
  
  app.use(cookieParser(process.env.CSRF_SECRET));

  const csrfMiddleware = new CsrfMiddleware();
  app.use(csrfMiddleware.use.bind(csrfMiddleware));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🔥 App rodando na porta ${port}!`);
}

bootstrap();
