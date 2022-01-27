import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
async function bootstrap(): Promise<void> {
    const whitelist = [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://localhost:4000',
        'https://airbnb-end-course.herokuapp.com',
    ];
    config();
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    const configService = app.get(ConfigService);
    app.setGlobalPrefix(configService.get<string>('apiPrefix'));

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Airbnb API')
        .setDescription('The Airbnb API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const port = configService.get<number>('port');
    app.enableCors({
        credentials: true,
        // origin: 'http://localhost:3000',
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                console.log('allowed cors for:', origin);
                callback(null, true);
            } else {
                console.log('blocked cors for:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        exposedHeaders: ['Set-Cookie'],
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port, () => {
        console.log('server run port: ' + port.toString());
    });
}
void bootstrap();
