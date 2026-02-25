import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

function configureApp(app: any, configService: ConfigService) {
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const allowedOrigins = corsOrigin
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  configureApp(app, configService);

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);
}

const server = express();
let cachedHandler: ((req: any, res: any) => void) | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    const configService = app.get(ConfigService);
    configureApp(app, configService);
    await app.init();
    cachedHandler = server;
  }

  return cachedHandler(req, res);
}

if (process.env.VERCEL !== '1') {
  bootstrap();
}
