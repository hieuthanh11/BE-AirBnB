import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { classes } from '@automapper/classes';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersHttpModule } from './users/users-http.module';
import { ConfigModule } from '@nestjs/config';
import { RoleHttpModule } from './roles/roles-http.module';
import { LoggerModule } from './logger/logger.module';
import { config } from 'dotenv';
import { DatabaseModule } from './database/database.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { AutomapperModule } from '@automapper/nestjs';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';
import { RolesGuard } from './Guards/roles.guard';
import { EmailModule } from './email/email.module';
import { GoogleModule } from './google/google.module';
import { StatusHttpModule } from './status/status-http.module';
import { UtilsHttpModule } from './utils/utils-http.module';
import { RoomHttpModule } from './room/room-http.module';
import { TicketHttpModule } from './ticket/ticket-http.module';
import { ServicesHttpModule } from './services/services-http.module';
import { HotelHttpModule } from './hotel/hotel-http.module';
import { DiscountHttpModule } from './discount/discount-http.module';
import { ImageHotelHttpModule } from './image-hotel/imageHotel-http.module';
import { ImageRoomHttpModule } from './imageroom/imageroom-http.module';
import { FacebookModule } from './facebook/facebook.module';

config();
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.development.env',
            isGlobal: true,
            load: [
                appConfig,
                databaseConfig,
                // , authConfig
            ],
        }),

        AutomapperModule.forRoot({
            options: [{ name: 'blah', pluginInitializer: classes }],
            singular: true,
        }),

        UsersHttpModule,
        RoleHttpModule,
        DatabaseModule,
        LoggerModule,
        AuthModule,
        GoogleModule,
        EmailModule,
        StatusHttpModule,
        HotelHttpModule,
        ServicesHttpModule,
        RoomHttpModule,
        UtilsHttpModule,
        DiscountHttpModule,
        TicketHttpModule,
        ImageHotelHttpModule,
        ImageRoomHttpModule,
        FacebookModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
