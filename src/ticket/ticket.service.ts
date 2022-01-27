import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { Payload } from 'src/core/Payload/payload';
import { EmailService } from 'src/email/email.service';
import { LoggerService } from 'src/logger/custom.logger';
import { Room } from 'src/room/entities/room.entity';
import { RoomService } from 'src/room/room.service';
import { Status } from 'src/status/entities/status.entity';
import { Status_ENUM, Status_Ticket } from 'src/status/status.enum';
import { StatusService } from 'src/status/status.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import TicketDTO from './dto/ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketRepository } from './ticket.repository';
export interface ObjectPayment {
    items: Item[];
    sum: number;
    hotelName: string;
}
export class Item {
    name: string;
    sku: string;
    price: number;
    currency: string;
    quantity: number;
    constructor(name: string, sku: string, price: number, currency: string, quantity: number) {
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.currency = currency;
        this.quantity = quantity;
    }
}
@Injectable()
export class TicketService extends BaseService<Ticket, TicketRepository> {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private roomService: RoomService,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        private statusService: StatusService,
        @Inject(forwardRef(() => EmailService))
        private emailService: EmailService,
        repository: TicketRepository,
        logger: LoggerService,
    ) {
        super(repository, logger);
    }
    async createTicket(data: CreateTicketDto, userPayload: User): Promise<string> {
        const roomList: Room[] = [];
        const nameRoom: string[] = [];
        const items: Item[] = [];

        let sum = 0;
        const roomFirst: Room = await this.roomService.getRoomById(data.rooms[0].idRoom);
        for (const item of data.rooms) {
            const room: Room = await this.roomService.getRoomById(item.idRoom);
            if (roomFirst.hotels.name !== room.hotels.name) {
                throw new BadRequestException(
                    `You can't book two rooms in two hotel (${roomFirst.hotels.name}, ${room.hotels.name}) in a ticket`,
                );
            }
            if (room.status.status === Status_ENUM.UNAVAILABLE) {
                nameRoom.push(room.maPhong.toString());
            } else {
                sum += room.price - room.price * (room.discounts.price / 100);
                roomList.push(room);
                items.push(
                    new Item(
                        room.maPhong.toString(),
                        `IDroom: ${room.maPhong}`,
                        room.price,
                        'USD',
                        1,
                    ),
                );
            }
        }
        if (nameRoom.length > 0) {
            let itemRoomStr = '';
            for (const item of nameRoom) {
                if (nameRoom.length > 1) {
                    itemRoomStr += item + ' & ';
                } else {
                    itemRoomStr += item;
                }
            }
            if (nameRoom.length > 1) {
                itemRoomStr = itemRoomStr.substring(0, itemRoomStr.lastIndexOf('&'));
            }

            throw new BadRequestException(`this room (${itemRoomStr}) UNAVAILABLE`);
        }
        const user: User = await this.userService.getUserById(userPayload.id);
        const statusUnavailable: Status = await this.statusService.findStatusByName(
            Status_ENUM.UNAVAILABLE,
        );
        const statusProcess: Status = await this.statusService.findStatusByName(
            Status_Ticket.PROCESS,
        );

        const objectPayment: ObjectPayment = { items, sum, hotelName: roomList[0].hotels.name };
        await this.emailService.sendTicketConfirmation(user, objectPayment, data);
        return await this.repository.createTicket(
            data,
            roomList,
            sum,
            user,
            statusUnavailable,
            statusProcess,
        );
    }

    async getAllTicket(hostID: string): Promise<Ticket[]> {
        return await this.repository.getAllTicket(hostID);
    }

    async getAllTicketByUser(userPayload: Payload): Promise<Ticket[]> {
        return await this.repository.getAllTicketByUser(userPayload.id);
    }

    async getTicketByIdUser(id: string, idUserOrder: string): Promise<Ticket> {
        const ticket = await this.repository.getTicketByIdUser(id, idUserOrder);
        if (!ticket) {
            throw new BadRequestException(`You don't have ticket id ${id} `);
        }
        return await this.repository.getTicketByIdUser(id, idUserOrder);
    }

    async getTicketByIdHost(id: string, idUserOrder: string): Promise<Ticket> {
        const ticket = await this.repository.getTicketByIdHost(id, idUserOrder);
        if (!ticket) {
            throw new BadRequestException(`You don't have ticket id ${id} `);
        }
        return await this.repository.getTicketByIdHost(id, idUserOrder);
    }

    isSameDay = (d1: Date, d2: Date): boolean => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth()
        );
    };

    isFromBiggerThanTo(dtmfrom: string, dtmto: string): boolean {
        return new Date(dtmfrom).getTime() >= new Date(dtmto).getTime();
    }

    async checkIn(id: string, userId: string): Promise<string> {
        const statusSuccess: Status = await this.statusService.findStatusByName(
            Status_Ticket.SUCCESS,
        );

        const ticket: Ticket = await this.repository.getTicketByIdHost(id, userId);

        if (!ticket) {
            throw new BadRequestException(`You don't have ticket id ${id} `);
        }

        if (this.isSameDay(new Date(ticket.startDate), new Date())) {
            return await this.repository.checkInOut(id, statusSuccess);
        } else {
            if (this.isFromBiggerThanTo(new Date().toLocaleDateString(), ticket.startDate)) {
                throw new BadRequestException(`Your ticket was expired ${ticket.startDate} `);
            } else {
                throw new BadRequestException(
                    `You can not checkIn on Day: ${new Date().toLocaleDateString()} before day booked ${new Date(
                        ticket.startDate,
                    ).toLocaleDateString()}`,
                );
            }
        }
    }

    async checkOut(id: string, userId: string): Promise<string> {
        const statusDone: Status = await this.statusService.findStatusByName(Status_Ticket.DONE);

        const statusAvailable: Status = await this.statusService.findStatusByName(
            Status_ENUM.AVAILABLE,
        );
        const ticket: Ticket = await this.repository.getTicketByIdHost(id, userId);
        if (!ticket) {
            throw new BadRequestException(`You don't have ticket id ${id} `);
        }

        if (ticket.status.status === Status_Ticket.PROCESS) {
            throw new BadRequestException("Can't checkOut before checkIn");
        }
        if (ticket.status.status === Status_Ticket.DONE) {
            throw new BadRequestException('Sorry!! This ticket was used');
        }

        for (const item of ticket.roomTicket) {
            await this.roomService.updateRoomStatus(statusAvailable, item.room.id);
        }

        return await this.repository.checkInOut(id, statusDone);
    }

    async deleteTicketById(id: string, userId: string): Promise<string> {
        const ticket: Ticket = await this.repository.getTicketByIdUser(id, userId);
        if (!ticket) {
            throw new BadRequestException(`You don't have ticket id ${id} `);
        }
        const dateAllowCancel = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date(ticket.startDate).getDate() - 3,
        );
        if (
            this.isFromBiggerThanTo(
                new Date().toLocaleDateString(),
                dateAllowCancel.toLocaleDateString(),
            )
        ) {
            throw new BadRequestException(
                `Your can not cancel this ticket ${dateAllowCancel.toLocaleDateString()} less than 3 days before the checkIn day`,
            );
        } else {
            return await this.repository.deleteTicketById(id, ticket);
        }
    }

    async getAllPaginationTicket(
        hostId: string,
        sizePage: number,
        numberPage: number,
        sortBy: string,
    ): Promise<[TicketDTO[], number]> {
        const [result, count] = await this.repository.getAllPaginationTicket(
            hostId,
            sizePage,
            numberPage,
            sortBy,
        );
        const tickeDto: TicketDTO[] = [];
        for (const item of result) {
            tickeDto.push(this.mapper.map(item, TicketDTO, Ticket));
        }
        return [tickeDto, count];
    }
}
