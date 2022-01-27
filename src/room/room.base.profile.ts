import { Room } from 'src/room/entities/room.entity';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, mapFrom, mapWith } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Util } from 'src/utils/entities/util.entity';
import UtilDto from 'src/utils/dto/util.dto';
import RoomBaseRootDto from './dto/room.base.root.dto';
import { RoomImageDto } from 'src/imageroom/dto/roomImage.dto';
import { Imageroom } from 'src/imageroom/entities/imageroom.entity';

@Injectable()
export class RoomProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Room, RoomBaseRootDto)
                .forMember(
                    (destination: RoomBaseRootDto) => destination.status,
                    mapFrom((source: Room) => {
                        return source.status.status;
                    }),
                )
                .forMember(
                    (destination: RoomBaseRootDto) => destination.utils,
                    mapWith(UtilDto, Util, (source) => {
                        return source.utils;
                    }),
                )
                .forMember(
                    (destination: RoomBaseRootDto) => destination.discount,
                    mapFrom((source: Room) => {
                        return source.discounts.price;
                    }),
                )
                .forMember(
                    (destination: RoomBaseRootDto) => destination.images,
                    mapWith(RoomImageDto, Imageroom, (source) => {
                        return source.imagesRoom;
                    }),
                );
        };
    }
}
