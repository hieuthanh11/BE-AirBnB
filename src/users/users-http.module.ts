import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfile } from './user.profile';
import { UsersModule } from './user.module';
import { RoleHttpModule } from 'src/roles/roles-http.module';
import { ROUTE_CONSTANTS_USERS_EXCLUDE } from 'src/constants/route.users.constants';
import { CheckMiddlewareUserExistByEmail } from 'src/middlewares/checkUserExistByEmail.middleware';
import { CheckMiddlewareUsername } from 'src/middlewares/checkUsername.middleware';
import { StatusHttpModule } from 'src/status/status-http.module';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { PagerMiddleware } from 'src/middlewares/pagerMiddleware';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [UsersModule, RoleHttpModule, StatusHttpModule, EmailModule, NestjsFormDataModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        UserProfile,
        CheckMiddlewareUserExistByEmail,
        CheckMiddlewareUsername,
    ],
    exports: [UsersService],
})
export class UsersHttpModule {
    constructor(private userService: UsersService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.userService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_USERS_EXCLUDE.GET_ALL_USER_PAGINATION,
                    method: RequestMethod.GET,
                },
                { path: ROUTE_CONSTANTS_USERS_EXCLUDE.SIGN_UP_USER, method: RequestMethod.POST },
                { path: ROUTE_CONSTANTS_USERS_EXCLUDE.CREATE_USER_V1, method: RequestMethod.POST },
                { path: ROUTE_CONSTANTS_USERS_EXCLUDE.UPLOAD_AVATAR, method: RequestMethod.POST },
                {
                    path: ROUTE_CONSTANTS_USERS_EXCLUDE.UPDATE_PROFILE_V1,
                    method: RequestMethod.PATCH,
                },
                {
                    path: ROUTE_CONSTANTS_USERS_EXCLUDE.RESET_PASSWORD_V1,
                    method: RequestMethod.PATCH,
                },
                {
                    path: ROUTE_CONSTANTS_USERS_EXCLUDE.UPDATE_PASSWORD,
                    method: RequestMethod.PATCH,
                },
            )
            .forRoutes(UsersController);
        consumer.apply(PagerMiddleware).forRoutes({
            path: ROUTE_CONSTANTS_USERS_EXCLUDE.GET_ALL_USER_PAGINATION_NO_V1,
            method: RequestMethod.GET,
        });
        consumer.apply(CheckMiddlewareUserExistByEmail, CheckMiddlewareUsername).forRoutes({
            path: ROUTE_CONSTANTS_USERS_EXCLUDE.CREATE_USER,
            method: RequestMethod.POST,
        });
    }
}
