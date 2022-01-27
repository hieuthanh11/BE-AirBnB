import { AutoMap } from '@automapper/classes';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Room } from 'src/room/entities/room.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticket extends BaseEntityRoot {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    price: number;

    @AutoMap()
    @Column()
    startDate: string;

    @AutoMap()
    @Column()
    endDate: string;

    @AutoMap()
    @Column()
    isPayment: boolean;

    @OneToMany(() => RoomTicket, (roomTicket) => roomTicket.ticket, {
        cascade: true,
    })
    roomTicket: RoomTicket[];

    @ManyToOne(() => User, (user) => user.tickets, {
        cascade: true,
    })
    user: User;

    @ManyToOne(() => Status, (status) => status.tickets, {
        cascade: true,
    })
    status: Status;
}

@Entity('room_ticket')
export class RoomTicket {
    @AutoMap()
    @Column()
    priceRoom: number;

    @AutoMap()
    @Column()
    priceDiscount: number;

    @ManyToOne(() => Ticket, (ticket) => ticket.roomTicket, { primary: true, onDelete: 'CASCADE' })
    ticket: Ticket;

    @ManyToOne(() => Room, (room) => room.roomTicket, { primary: true, onDelete: 'CASCADE' })
    room: Room;
}
