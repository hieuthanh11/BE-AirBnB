import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ROUTE_CONSTANTS_IMAGEROOM_EXCLUDE } from 'src/constants/route.imageroom.constants';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { PagerMiddleware } from 'src/middlewares/pagerMiddleware';
import { RoomHttpModule } from 'src/room/room-http.module';
import { RoomService } from 'src/room/room.service';
import { ImageroomController } from './imageroom.controller';
import { ImageroomModule } from './imageroom.module';
import { ImageRoomProfile } from './imageroom.profile';
import { ImageRoomRepository } from './imageroom.repository';
import { ImageroomService } from './imageroom.service';
import { RoomImageProfile } from './roomImage.profile';

@Module({
    imports: [ImageroomModule, ImageRoomRepository, RoomHttpModule, NestjsFormDataModule],
    controllers: [ImageroomController],
    providers: [ImageroomService, ImageRoomProfile, PagerMiddleware, RoomImageProfile],
    exports: [ImageroomService],
})
export class ImageRoomHttpModule {
    constructor(private imageRoomService: ImageroomService, private roomService: RoomService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.imageRoomService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_IMAGEROOM_EXCLUDE.GET_ALL_IMAGEROOM,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_IMAGEROOM_EXCLUDE.CREATE_IMAGEROOM,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_IMAGEROOM_EXCLUDE.DELETE_IMAGE_BY_ROOM_ID,
                    method: RequestMethod.DELETE,
                },
            )
            .forRoutes(ImageroomController);
        consumer.apply(PagerMiddleware).forRoutes({
            path: ROUTE_CONSTANTS_IMAGEROOM_EXCLUDE.GET_ALL_PAGINATION_NO_V1,
            method: RequestMethod.GET,
        });
        consumer.apply(checkExistIdParam(this.roomService)).forRoutes({
            path: ROUTE_CONSTANTS_IMAGEROOM_EXCLUDE.DELETE_IMAGE_BY_ROOM_ID_NO_V1,
            method: RequestMethod.DELETE,
        });
    }
}
