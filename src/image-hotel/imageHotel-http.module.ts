import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ROUTE_CONSTANTS_IMAGEHOTEL_EXCLUDE } from 'src/constants/route.imagehotel.constants';
import { HotelHttpModule } from 'src/hotel/hotel-http.module';
import { HotelService } from 'src/hotel/hotel.service';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { PagerMiddleware } from 'src/middlewares/pagerMiddleware';
import { HotelImageProfile } from './hotel-image.profile';
import { ImageHotelController } from './image-hotel.controller';
import { ImageHotelModule } from './image-hotel.module';
import { ImageHotelService } from './image-hotel.service';
import { ImageHotelProfile } from './imageHotel.profile';
import { ImageHotelRepository } from './imageHotel.repository';

@Module({
    imports: [ImageHotelModule, ImageHotelRepository, HotelHttpModule, NestjsFormDataModule],
    controllers: [ImageHotelController],
    providers: [ImageHotelService, ImageHotelProfile, PagerMiddleware, HotelImageProfile],
    exports: [ImageHotelService],
})
export class ImageHotelHttpModule {
    constructor(private imageHotelService: ImageHotelService, private hotelService: HotelService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.imageHotelService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_IMAGEHOTEL_EXCLUDE.GET_ALL_IMAGEHOTEL,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_IMAGEHOTEL_EXCLUDE.CREATE_IMAGEHOTEL,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_IMAGEHOTEL_EXCLUDE.GET_ALL_HOTEL_PAGINATION,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_IMAGEHOTEL_EXCLUDE.REMOVE_ALL_IMAGEHOTEL,
                    method: RequestMethod.DELETE,
                },
            )
            .forRoutes(ImageHotelController);
        consumer.apply(PagerMiddleware).forRoutes({
            path: ROUTE_CONSTANTS_IMAGEHOTEL_EXCLUDE.GET_ALL_HOTEL_PAGINATION_NO_V1,
            method: RequestMethod.GET,
        });
    }
}
