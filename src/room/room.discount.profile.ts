import { Room } from 'src/room/entities/room.entity';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { RoomDiscountDto } from 'src/discount/dto/discount-room.dto';

@Injectable()
export class RoomDiscountProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Room, RoomDiscountDto)
                .forMember(
                    (destination: RoomDiscountDto) => destination.id,
                    mapFrom((source: Room) => {
                        return source.id;
                    }),
                )
                .forMember(
                    (destination: RoomDiscountDto) => destination.hotelName,
                    mapFrom((source: Room) => {
                        return source.hotels.name;
                    }),
                )
                .forMember(
                    (destination: RoomDiscountDto) => destination.hostName,
                    mapFrom((source: Room) => {
                        return source.hotels.user.userName;
                    }),
                );
        };
    }
}
