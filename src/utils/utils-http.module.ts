import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerService } from 'src/logger/custom.logger';
import { UtilsController } from './utils.controller';
import { UtilsModule } from './utils.module';
import { ROUTE_CONSTANTS_UTILS_EXCLUDE } from 'src/constants/route.utils.constant';
import { UtilsService } from './utils.service';
import { UtilProfile } from './utils.profile';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';

@Module({
    imports: [UtilsModule, LoggerService],
    providers: [UtilsService, UtilProfile],
    exports: [UtilsService],
    controllers: [UtilsController],
})
export class UtilsHttpModule {
    constructor(private utilService: UtilsService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.utilService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_UTILS_EXCLUDE.GET_ALL_UTIL,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_UTILS_EXCLUDE.CREATE_UTIL,
                    method: RequestMethod.POST,
                },
            )
            .forRoutes(UtilsController);
    }
}
