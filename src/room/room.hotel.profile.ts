import { Room } from 'src/room/entities/room.entity';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, mapFrom, mapWith } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import RoomDto from './dto/room.dto';
import UtilDto from 'src/utils/dto/util.dto';
import { Util } from 'src/utils/entities/util.entity';
import { RoomImageDto } from 'src/imageroom/dto/roomImage.dto';
import { Imageroom } from 'src/imageroom/entities/imageroom.entity';

@Injectable()
export class RoomHotelProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Room, RoomDto)
                .forMember(
                    (destination: RoomDto) => destination.status,
                    mapFrom((source: Room) => {
                        return source.status.status;
                    }),
                )
                .forMember(
                    (destination: RoomDto) => destination.hotel,
                    mapFrom((source: Room) => {
                        return source.hotels.name;
                    }),
                )
                .forMember(
                    (destination: RoomDto) => destination.discount,
                    mapFrom((source: Room) => {
                        return source.discounts.price;
                    }),
                )
                .forMember(
                    (destination: RoomDto) => destination.utils,
                    mapWith(UtilDto, Util, (source) => {
                        return source.utils;
                    }),
                )
                .forMember(
                    (destination: RoomDto) => destination.images,
                    mapWith(RoomImageDto, Imageroom, (source) => {
                        return source.imagesRoom;
                    }),
                );
        };
    }
}
