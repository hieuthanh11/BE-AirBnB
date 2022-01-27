import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_DISCOUNT_EXCLUDE } from 'src/constants/route.discount.contants';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { PagerMiddleware } from 'src/middlewares/pagerMiddleware';
import { RoomHttpModule } from 'src/room/room-http.module';
import { StatusHttpModule } from 'src/status/status-http.module';
import { UsersHttpModule } from 'src/users/users-http.module';
import { DiscountController } from './discount.controller';
import { DiscountModule } from './discount.module';
import { DiscountProfile } from './discount.profile';
import { DiscountRepository } from './discount.repository';
import { DiscountRoomProfile } from './discount.room.profile';
import { DiscountService } from './discount.service';

@Module({
    imports: [
        DiscountModule,
        DiscountRepository,
        StatusHttpModule,
        forwardRef(() => RoomHttpModule),
        forwardRef(() => UsersHttpModule),
    ],
    controllers: [DiscountController],
    providers: [DiscountService, DiscountProfile, PagerMiddleware, DiscountRoomProfile],
    exports: [DiscountService],
})
export class DiscountHttpModule {
    constructor(private discountService: DiscountService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.discountService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_DISCOUNT_EXCLUDE.GET_ALL_DISCOUNT,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_DISCOUNT_EXCLUDE.CREATE_DISCOUNT,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_DISCOUNT_EXCLUDE.GET_ALL_PAGINATION,
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(DiscountController);
        consumer.apply(PagerMiddleware).forRoutes({
            path: ROUTE_CONSTANTS_DISCOUNT_EXCLUDE.GET_ALL_PAGINATION_NO_V1,
            method: RequestMethod.GET,
        });
    }
}
