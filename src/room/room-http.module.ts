import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_ROOM_EXCLUDE } from 'src/constants/route.room.constants';
import { DiscountHttpModule } from 'src/discount/discount-http.module';
import { HotelHttpModule } from 'src/hotel/hotel-http.module';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { PagerMiddleware } from 'src/middlewares/pagerMiddleware';
import { StatusHttpModule } from 'src/status/status-http.module';
import { UtilsHttpModule } from 'src/utils/utils-http.module';
import { RoomProfile } from './room.base.profile';
import { RoomController } from './room.controller';
import { RoomDiscountProfile } from './room.discount.profile';
import { RoomHotelProfile } from './room.hotel.profile';
import { RoomModule } from './room.module';
import { RoomService } from './room.service';

@Module({
    imports: [
        RoomModule,
        StatusHttpModule,
        UtilsHttpModule,
        forwardRef(() => DiscountHttpModule),
        forwardRef(() => HotelHttpModule),
    ],
    controllers: [RoomController],
    providers: [RoomService, RoomProfile, RoomHotelProfile, RoomDiscountProfile],
    exports: [RoomService],
})
export class RoomHttpModule {
    constructor(private roomService: RoomService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.roomService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_ROOM_EXCLUDE.GET_ALL_ROOM,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_ROOM_EXCLUDE.CREATE_ROOM,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_ROOM_EXCLUDE.GET_ALL_ROOM_BY_ID_HOTEL,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_ROOM_EXCLUDE.GET_ALL_ROOM_PAGINATION,
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(RoomController);
        consumer.apply(PagerMiddleware).forRoutes({
            path: ROUTE_CONSTANTS_ROOM_EXCLUDE.GET_ALL_ROOM_PAGINATION_NO_V1,
            method: RequestMethod.GET,
        });
    }
}
