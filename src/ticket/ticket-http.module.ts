import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ROUTE_CONSTANTS_TICKET_EXCLUDE } from 'src/constants/route.ticket.constants';
import { EmailModule } from 'src/email/email.module';
import { checkExistIdParam } from 'src/middlewares/checkExistIdParam.middleware';
import { RoomHttpModule } from 'src/room/room-http.module';
import { StatusHttpModule } from 'src/status/status-http.module';
import { UsersHttpModule } from 'src/users/users-http.module';
import { RoomTicketProfile } from './room.ticket.profile';
import { TicketController } from './ticket.controller';
import { TicketModule } from './ticket.module';
import { TicketProfile } from './ticket.profile';
import { TicketService } from './ticket.service';

@Module({
    imports: [
        TicketModule,
        RoomHttpModule,
        forwardRef(() => UsersHttpModule),
        StatusHttpModule,
        EmailModule,
    ],
    controllers: [TicketController],
    providers: [TicketService, TicketProfile, RoomTicketProfile],
    exports: [TicketService],
})
export class TicketHttpModule {
    constructor(private ticketService: TicketService) {}
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(checkExistIdParam(this.ticketService))
            .exclude(
                {
                    path: ROUTE_CONSTANTS_TICKET_EXCLUDE.CREATE_TICKET,
                    method: RequestMethod.POST,
                },
                {
                    path: ROUTE_CONSTANTS_TICKET_EXCLUDE.GET_ALL_TICKET,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_TICKET_EXCLUDE.GET_ALL_TICKET_BY_USER,
                    method: RequestMethod.GET,
                },
                {
                    path: ROUTE_CONSTANTS_TICKET_EXCLUDE.GET_ALL_PAGINATION,
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(TicketController);
    }
}
