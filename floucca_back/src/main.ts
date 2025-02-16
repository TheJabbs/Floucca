import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {TypeTransformPipe} from "./pipes/TypeTransformPipe";
import {startAuto} from "./auto/shceduler";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new TypeTransformPipe());

  // Start the auto scheduler
  startAuto();


  await app.listen(3000);
}
bootstrap();