import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Game API')
    .setDescription('API documentation for Game project')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));


  app.use(cookieParser());
  app.enableCors({
    origin: [
      'https://backendforgames.com',
      'http://localhost:5173',
      'http://localhost' // TODO: Special for Vladislav Appache Server, remove that in production
    ],
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  await app.listen(8000);

}

bootstrap();
