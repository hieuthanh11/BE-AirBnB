import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersHttpModule } from 'src/users/users-http.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants, TimeOut } from 'src/constants/auth.constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { EmailModule } from 'src/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { CheckMiddlewareUserExistByEmail } from 'src/middlewares/checkUserExistByEmail.middleware';
import { CheckMiddlewareUsername } from 'src/middlewares/checkUsername.middleware';
import { RoleHttpModule } from 'src/roles/roles-http.module';
@Module({
    imports: [
        UsersHttpModule,
        EmailModule,
        RoleHttpModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: TimeOut.accessToken },
        }),
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
    exports: [AuthService],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(CheckMiddlewareUserExistByEmail, CheckMiddlewareUsername).forRoutes({
            path: '/auth/signup',
            method: RequestMethod.POST,
        });
    }
}
