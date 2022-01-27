import { mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { HotelImagesDto } from './dto/hotel-image.dto';
import { ImageHotel } from './entities/image-hotel.entity';

@Injectable()
export class HotelImageProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper: Mapper): void => {
            mapper.createMap(ImageHotel, HotelImagesDto).forMember(
                (destination: HotelImagesDto) => destination.id,
                mapFrom((source: ImageHotel) => source.id),
            );
        };
    }
}
