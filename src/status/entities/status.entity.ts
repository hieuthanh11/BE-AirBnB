import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Discount } from 'src/discount/entities/discount.entity';
import { Room } from 'src/room/entities/room.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'status' })
export class Status extends BaseEntityRoot {
    @AutoMap()
    @ApiProperty()
    @Column()
    status: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    description: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    expired: string;

    @AutoMap()
    @OneToMany(() => User, (user) => user.status)
    users: User[];

    @AutoMap()
    @OneToMany(() => Room, (room) => room.status)
    rooms: Room[];

    @AutoMap()
    @OneToMany(() => Discount, (discount) => discount.status)
    discounts: Discount[];

    @OneToMany(() => Ticket, (ticket) => ticket.status)
    tickets: Ticket[];
}
