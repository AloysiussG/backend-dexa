import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

// sementara tidak menggunakan .env supaya mudah &
// dapat langsung dipakai untuk test
export const URL = {
  NEXT_FRONTEND_APP_URL: 'http://localhost:3000',
  NEST_BACKEND_APP_URL: 'http://localhost:8000',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // winston
  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Enable CORS
  app.enableCors({
    origin: URL.NEXT_FRONTEND_APP_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
