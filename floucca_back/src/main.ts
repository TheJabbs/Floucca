import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {TypeTransformPipe} from './pipes/type_transform_pipe';
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        //origin: true, //for development, you can set this to true to allow all origins
        origin: 'http://13.37.42.136:3000', // Replace with your frontend URL
        methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
        allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
        credentials: true, // Allow credentials if necessary
    });
    
    

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
        new TypeTransformPipe(),
    );
    app.use(cookieParser());


    await app.listen(4000, '0.0.0.0');
}

bootstrap();
