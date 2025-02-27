import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeTransformPipe } from './pipes/TypeTransformPipe';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new TypeTransformPipe());
  app.useGlobalPipes(new ValidationPipe());




  await app.listen(3000);
}
bootstrap();
