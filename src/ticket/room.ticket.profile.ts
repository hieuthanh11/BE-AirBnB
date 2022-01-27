import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { RoomTicket } from './entities/ticket.entity';
import { RoomTicketDTO } from './dto/ticket.dto';

@Injectable()
export class RoomTicketProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(RoomTicket, RoomTicketDTO)
                .forMember(
                    (destination: RoomTicketDTO) => destination.maPhong,
                    mapFrom((source: RoomTicket) => {
                        return source.room.maPhong;
                    }),
                )
                .forMember(
                    (destination: RoomTicketDTO) => destination.discount,
                    mapFrom((source: RoomTicket) => {
                        return `${source.room.discounts.price}%`;
                    }),
                )
                .forMember(
                    (destination: RoomTicketDTO) => destination.hotelName,
                    mapFrom((source: RoomTicket) => {
                        return source.room.hotels.name;
                    }),
                )
                .forMember(
                    (destination: RoomTicketDTO) => destination.hostName,
                    mapFrom((source: RoomTicket) => {
                        return source.room.hotels.user.userName;
                    }),
                );
        };
    }
}
