import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersHttpModule } from 'src/users/users-http.module';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';

@Module({
    imports: [UsersHttpModule, AuthModule, EmailModule, ConfigModule, HttpModule],
    controllers: [FacebookController],
    providers: [FacebookService],
})
export class FacebookModule {}
