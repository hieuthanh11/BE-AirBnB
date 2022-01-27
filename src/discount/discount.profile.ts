import { mapFrom, Mapper, MappingProfile, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import RoomBaseRootDto from 'src/room/dto/room.base.root.dto';
import { Room } from 'src/room/entities/room.entity';
import { DiscountDto } from './dto/discount.dto';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Discount, DiscountDto)
                .forMember(
                    (destination: DiscountDto) => destination.id,
                    mapFrom((source: Discount) => source.id),
                )
                .forMember(
                    (destination: DiscountDto) => destination.status,
                    mapFrom((source: Discount) => source.status.status),
                )
                .forMember(
                    (destination: DiscountDto) => destination.rooms,
                    mapWith(RoomBaseRootDto, Room, (source) => source.rooms),
                );
        };
    }
}
