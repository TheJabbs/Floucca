import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {TypeTransformPipe} from './pipes/type_transform_pipe';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://13.37.108.197:3000', 'http://localhost:3000'],
        methods: 'GET,POST,PUT,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });
    

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
        new TypeTransformPipe(),
    );


    await app.listen(4000);
}

bootstrap();
