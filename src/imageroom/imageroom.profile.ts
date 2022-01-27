import { mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ImageRoomDto } from './dto/imageroom.dto';
import { Imageroom } from './entities/imageroom.entity';

@Injectable()
export class ImageRoomProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Imageroom, ImageRoomDto)
                .forMember(
                    (destination: ImageRoomDto) => destination.id,
                    mapFrom((source: Imageroom) => source.id),
                )
                .forMember(
                    (destination: ImageRoomDto) => destination.roomId,
                    mapFrom((source: Imageroom) => source.room.id),
                )
                .forMember(
                    (destination: ImageRoomDto) => destination.maPhong,
                    mapFrom((source: Imageroom) => source.room.maPhong),
                );
        };
    }
}
