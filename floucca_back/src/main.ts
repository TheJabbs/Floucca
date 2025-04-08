import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {TypeTransformPipe} from './pipes/type_transform_pipe';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://13.37.108.197:3000', 'http://localhost:3000'], // List multiple allowed origins
        methods: 'GET,POST,PUT,DELETE',       // Specify allowed HTTP methods
        allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
        credentials: true,  // Allow cookies if necessary
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
