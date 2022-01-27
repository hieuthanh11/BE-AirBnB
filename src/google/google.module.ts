import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersHttpModule } from 'src/users/users-http.module';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
    imports: [UsersHttpModule, AuthModule, EmailModule, ConfigModule],
    controllers: [GoogleController],
    providers: [GoogleService],
})
export class GoogleModule {}
