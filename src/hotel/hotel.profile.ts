import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, mapFrom, mapWith } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Hotel } from './entities/hotel.entity';
import HotelDto from './dto/hotel.dto';
import ServiceDto from 'src/services/dto/service.dto';
import { Room } from 'src/room/entities/room.entity';
import { Service } from 'src/services/entities/service.entity';
import RoomBaseRootDto from 'src/room/dto/room.base.root.dto';
import { HotelImagesDto } from 'src/image-hotel/dto/hotel-image.dto';
import { ImageHotel } from 'src/image-hotel/entities/image-hotel.entity';

@Injectable()
export class HotelProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Hotel, HotelDto)
                .forMember(
                    (destination: HotelDto) => destination.hostName,
                    mapFrom((source: Hotel) => source.user.userName),
                )
                .forMember(
                    (destination: HotelDto) => destination.services,
                    mapWith(ServiceDto, Service, (source) => {
                        return source.services;
                    }),
                )
                .forMember(
                    (destination: HotelDto) => destination.rooms,
                    mapWith(RoomBaseRootDto, Room, (source) => {
                        return source.rooms;
                    }),
                )
                .forMember(
                    (destination: HotelDto) => destination.images,
                    mapWith(HotelImagesDto, ImageHotel, (source) => {
                        return source.imagesHotel;
                    }),
                );
        };
    }
}
