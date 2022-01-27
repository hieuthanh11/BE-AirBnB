import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { mapFrom, Mapper, mapWith } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { RoomTicket, Ticket } from './entities/ticket.entity';
import TicketDTO, { RoomTicketDTO } from './dto/ticket.dto';

@Injectable()
export class TicketProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Ticket, TicketDTO)
                .forMember(
                    (destination: TicketDTO) => destination.name,
                    mapFrom((source: Ticket) => {
                        return source.user.userName;
                    }),
                )
                .forMember(
                    (destination: TicketDTO) => destination.status,
                    mapFrom((source: Ticket) => {
                        return source.status.status;
                    }),
                )
                .forMember(
                    (destination: TicketDTO) => destination.roomTicket,
                    mapWith(RoomTicketDTO, RoomTicket, (source) => {
                        return source.roomTicket;
                    }),
                );
        };
    }
}
