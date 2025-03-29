import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {TypeTransformPipe} from './pipes/type_transform_pipe';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
        new TypeTransformPipe());


    await app.listen(4000);
}

bootstrap();
