import { mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ImageHotelDto } from './dto/image-hotel.dto';
import { ImageHotel } from './entities/image-hotel.entity';

@Injectable()
export class ImageHotelProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper: Mapper): void => {
            mapper
                .createMap(ImageHotel, ImageHotelDto)
                .forMember(
                    (destination: ImageHotelDto) => destination.id,
                    mapFrom((source: ImageHotel) => source.id),
                )
                .forMember(
                    (destination: ImageHotelDto) => destination.hotelId,
                    mapFrom((source: ImageHotel) => source.hotel.id),
                )
                .forMember(
                    (destination: ImageHotelDto) => destination.name,
                    mapFrom((source: ImageHotel) => source.hotel.name),
                );
        };
    }
}
