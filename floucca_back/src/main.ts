import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeTransformPipe } from './pipes/TypeTransformPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new TypeTransformPipe());



  await app.listen(3000);
}
bootstrap();
