import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_HOTEL_EXCLUDE } from 'src/constants/route.hotel.constants';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { PagerMiddleware } from 'src/middlewares/pagerMiddleware';
import { RoomHttpModule } from 'src/room/room-http.module';
import { ServicesHttpModule } from 'src/services/services-http.module';
import { UsersHttpModule } from 'src/users/users-http.module';
import { HotelController } from './hotel.controller';
import { HotelModule } from './hotel.module';
import { HotelProfile } from './hotel.profile';
import { HotelService } from './hotel.service';

@Module({
    imports: [
        HotelModule,
        forwardRef(() => UsersHttpModule),
        ServicesHttpModule,
        forwardRef(() => RoomHttpModule),
    ],
    providers: [HotelService, HotelProfile],
    exports: [HotelService],
    controllers: [HotelController],
})
export class HotelHttpModule {
    constructor(private hotelService: HotelService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.hotelService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_HOTEL_EXCLUDE.GET_ALL_HOTEL,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_HOTEL_EXCLUDE.CREATE_HOTEL,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_HOTEL_EXCLUDE.GET_ALL_HOTEL_BY_HOST,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_HOTEL_EXCLUDE.GET_ALL_HOTEL_PAGINATION,
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(HotelController);
        consumer.apply(PagerMiddleware).forRoutes({
            path: ROUTE_CONSTANTS_HOTEL_EXCLUDE.GET_ALL_HOTEL_PAGINATION_NO_V1,
            method: RequestMethod.GET,
        });
    }
}
