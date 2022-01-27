import { NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DiscountService } from 'src/discount/discount.service';
import { HotelService } from 'src/hotel/hotel.service';
import { ImageHotelService } from 'src/image-hotel/image-hotel.service';
import { ImageroomService } from 'src/imageroom/imageroom.service';
import { RolesService } from 'src/roles/roles.service';
import { RoomService } from 'src/room/room.service';
import { ServicesService } from 'src/services/services.service';
import { StatusService } from 'src/status/status.service';
import { TicketService } from 'src/ticket/ticket.service';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
type TypeService =
    | RolesService
    | UsersService
    | StatusService
    | ServicesService
    | HotelService
    | DiscountService
    | RoomService
    | UtilsService
    | TicketService
    | ImageHotelService
    | ImageroomService;
export const checkExistIdParam =
    (service: TypeService) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> => {
        console.log(`Request...`);
        const data = await service.findById(req.params.id);
        if (data != undefined) {
            return next();
        }
        throw new NotFoundException({ error: `${req.params.id} not found` });
    };
