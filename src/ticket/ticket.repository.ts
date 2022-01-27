import { Sort } from 'src/base/orderby.enum';
import { Room } from 'src/room/entities/room.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RoomTicket, Ticket } from './entities/ticket.entity';

@EntityRepository(Ticket)
export class TicketRepository extends Repository<Ticket> {
    async createTicket(
        data: CreateTicketDto,
        roomList: Room[],
        sum: number,
        user: User,
        statusUnavailable: Status,
        statusProcess: Status,
    ): Promise<string> {
        const ticket = new Ticket();
        ticket.price = sum;
        ticket.startDate = data.startDate;
        ticket.endDate = data.endDate;
        ticket.user = user;
        ticket.isPayment = true;
        ticket.status = statusProcess;
        const ticketSave = await this.save(ticket);
        for (const item of roomList) {
            await this.createQueryBuilder()
                .insert()
                .into(RoomTicket)
                .values({
                    priceRoom: item.price,
                    priceDiscount: item.price * (item.discounts.price / 100),
                    room: item,
                    ticket: ticketSave,
                })
                .execute();
            await this.createQueryBuilder()
                .update(Room)
                .set({ status: statusUnavailable })
                .where('id = :id', { id: item.id })
                .execute();
        }
        return 'Booked successfully ';
    }

    async getAllTicket(hostID: string): Promise<Ticket[]> {
        const ticketList = await this.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('ticket.status', 'status')
            .leftJoinAndSelect('ticket.roomTicket', 'room_ticket')
            .leftJoinAndSelect('room_ticket.room', 'room')
            .leftJoinAndSelect('room.discounts', 'roomDiscount')
            .leftJoinAndSelect('room.hotels', 'roomHotel')
            .leftJoinAndSelect('roomHotel.user', 'userHotel')
            .where('userHotel.id = :id', {
                id: hostID,
            })
            .orderBy('ticket.startDate', 'DESC')
            .getMany();
        return ticketList;
    }

    async getAllTicketByUser(userId: string): Promise<Ticket[]> {
        const ticketList = await this.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('ticket.roomTicket', 'room_ticket')
            .leftJoinAndSelect('ticket.status', 'status')
            .leftJoinAndSelect('room_ticket.room', 'room')
            .leftJoinAndSelect('room.discounts', 'discount')
            .leftJoinAndSelect('room.hotels', 'roomHotel')
            .leftJoinAndSelect('roomHotel.user', 'userHotel')
            .where('user.id = :id', {
                id: userId,
            })
            .orderBy('ticket.startDate', 'DESC')
            .getMany();
        return ticketList;
    }

    public async getAllPaginationTicket(
        hostID: string,
        sizePage: number,
        numberPage: number,
        sortBy: string,
    ): Promise<[Ticket[], number]> {
        const [list, count] = await Promise.all([
            await this.createQueryBuilder('ticket')
                .leftJoinAndSelect('ticket.user', 'user')
                .leftJoinAndSelect('ticket.roomTicket', 'room_ticket')
                .leftJoinAndSelect('ticket.status', 'status')
                .leftJoinAndSelect('room_ticket.room', 'room')
                .leftJoinAndSelect('room.discounts', 'discount')
                .leftJoinAndSelect('room.hotels', 'roomHotel')
                .leftJoinAndSelect('roomHotel.user', 'userHotel')
                .where('userHotel.id = :id', {
                    id: hostID,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .orderBy('ticket.startDate', sortBy as Sort)
                .getMany(),
            await this.createQueryBuilder('ticket')
                .leftJoinAndSelect('ticket.user', 'user')
                .leftJoinAndSelect('ticket.status', 'status')
                .leftJoinAndSelect('ticket.roomTicket', 'room_ticket')
                .leftJoinAndSelect('room_ticket.room', 'room')
                .leftJoinAndSelect('room.discounts', 'roomDiscount')
                .leftJoinAndSelect('room.hotels', 'roomHotel')
                .leftJoinAndSelect('roomHotel.user', 'userHotel')
                .where('userHotel.id = :id', {
                    id: hostID,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getCount(),
        ]);
        return [list, count];
    }

    async getTicketByIdUser(idTicket: string, idUser: string): Promise<Ticket> {
        const ticket = await this.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('ticket.roomTicket', 'room_ticket')
            .leftJoinAndSelect('ticket.status', 'status')
            .leftJoinAndSelect('room_ticket.room', 'room')
            .leftJoinAndSelect('room.discounts', 'discount')
            .leftJoinAndSelect('room.hotels', 'roomHotel')
            .leftJoinAndSelect('roomHotel.user', 'userHotel')
            .where('ticket.id = :id', {
                id: idTicket,
            })
            .andWhere('user.id = :idUser', {
                idUser: idUser,
            })
            .getOne();
        return ticket;
    }

    async getTicketByIdHost(idTicket: string, idHost: string): Promise<Ticket> {
        const ticket = await this.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('ticket.roomTicket', 'room_ticket')
            .leftJoinAndSelect('ticket.status', 'status')
            .leftJoinAndSelect('room_ticket.room', 'room')
            .leftJoinAndSelect('room.discounts', 'discount')
            .leftJoinAndSelect('room.hotels', 'roomHotel')
            .leftJoinAndSelect('roomHotel.user', 'userHotel')
            .where('ticket.id = :id', {
                id: idTicket,
            })
            .andWhere('userHotel.id = :idUser', {
                idUser: idHost,
            })
            .getOne();
        return ticket;
    }

    async checkInOut(id: string, transitionStatus: Status): Promise<string> {
        await this.createQueryBuilder()
            .update(Ticket)
            .set({
                status: transitionStatus,
            })
            .where('id = :id', { id: id })
            .execute();
        return `update successfully ${id} to ${transitionStatus.status}`;
    }

    public async deleteTicketById(id: string, ticket: Ticket): Promise<string> {
        for (const item of ticket.roomTicket) {
            await this.createQueryBuilder()
                .delete()
                .from('room_ticket')
                .where('ticketId=:id', { id: ticket.id })
                .andWhere('roomId=:id', { id: item.room.id })
                .execute();
        }
        await this.createQueryBuilder()
            .delete()
            .from(Ticket)
            .where('id = :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }
}
