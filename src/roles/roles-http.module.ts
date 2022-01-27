import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_ROLES_EXCLUDE } from 'src/constants/route.roles.constants';
import { LoggerService } from 'src/logger/custom.logger';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { RolesController } from './roles.controller';
import { RolesModule } from './roles.module';
import { RolesService } from './roles.service';

@Module({
    imports: [RolesModule, LoggerService],
    providers: [RolesService],
    exports: [RolesService],
    controllers: [RolesController],
})
export class RoleHttpModule {
    constructor(private roleService: RolesService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.roleService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_ROLES_EXCLUDE.GET_ALL_ROLE,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_ROLES_EXCLUDE.CREATE_ROLE,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_ROLES_EXCLUDE.FIND_NAME_ROLE,
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(RolesController);
    }
}
