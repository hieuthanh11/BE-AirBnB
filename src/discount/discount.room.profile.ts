import { mapFrom, Mapper, MappingProfile, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { Room } from 'src/room/entities/room.entity';
import { DiscountRoomDto, RoomDiscountDto } from './dto/discount-room.dto';
import { Discount } from './entities/discount.entity';
@Injectable()
export class DiscountRoomProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Discount, DiscountRoomDto)
                .forMember(
                    (destination: DiscountRoomDto) => destination.id,
                    mapFrom((source: Discount) => source.id),
                )
                .forMember(
                    (destination: DiscountRoomDto) => destination.status,
                    mapFrom((source: Discount) => source.status.status),
                )
                .forMember(
                    (destination: DiscountRoomDto) => destination.rooms,
                    mapWith(RoomDiscountDto, Room, (source) => {
                        return source.rooms;
                    }),
                );
        };
    }
}
