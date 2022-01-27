import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_SERVICES_EXCLUDE } from 'src/constants/route.services.constants';
import { LoggerService } from 'src/logger/custom.logger';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { ServicesController } from './services.controller';
import { ServicesModule } from './services.module';
import { ServicesService } from './services.service';
import { ServiceProfile } from './sevices.profile';

@Module({
    imports: [ServicesModule, LoggerService],
    providers: [ServicesService, ServiceProfile],
    exports: [ServicesService],
    controllers: [ServicesController],
})
export class ServicesHttpModule {
    constructor(private servicesService: ServicesService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.servicesService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_SERVICES_EXCLUDE.GET_ALL_SERVICES,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_SERVICES_EXCLUDE.CREATE_SERVICES,
                    method: RequestMethod.POST,
                },
            )
            .forRoutes(ServicesController);
    }
}
