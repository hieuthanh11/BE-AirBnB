import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_STATUS_EXCLUDE } from 'src/constants/route.status.constants';
import { LoggerService } from 'src/logger/custom.logger';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { StatusController } from './status.controller';
import { StatusModule } from './status.module';
import { StatusService } from './status.service';

@Module({
    imports: [StatusModule, LoggerService],
    providers: [StatusService],
    exports: [StatusService],
    controllers: [StatusController],
})
export class StatusHttpModule {
    constructor(private statusService: StatusService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.statusService))
            .exclude(
                { path: ROUTE_CONSTANTS_STATUS_EXCLUDE.GET_ALL_STATUS, method: RequestMethod.GET },
                { path: ROUTE_CONSTANTS_STATUS_EXCLUDE.CREATE_STATUS, method: RequestMethod.POST },
            )
            .forRoutes(StatusController);
    }
}
