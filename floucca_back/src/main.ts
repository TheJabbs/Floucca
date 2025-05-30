import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeTransformPipe } from './pipes/type_transform_pipe';
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });




    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
        new TypeTransformPipe(),
    );
    //app.use(cookieParser());


    await app.listen(4000, '0.0.0.0');
}

bootstrap();
