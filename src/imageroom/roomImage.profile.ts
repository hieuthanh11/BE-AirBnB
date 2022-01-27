import { mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { RoomImageDto } from './dto/roomImage.dto';
import { Imageroom } from './entities/imageroom.entity';

@Injectable()
export class RoomImageProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper.createMap(Imageroom, RoomImageDto).forMember(
                (destination: RoomImageDto) => destination.id,
                mapFrom((source: Imageroom) => {
                    return source.id;
                }),
            );
        };
    }
}
