import { AutoMap } from '@automapper/classes';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Discount } from 'src/discount/entities/discount.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Status } from 'src/status/entities/status.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User extends BaseEntityRoot {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    userName: string;

    @AutoMap()
    @Column()
    firstName: string;

    @AutoMap()
    @Column()
    lastName: string;

    @AutoMap()
    @Column()
    password: string;

    @AutoMap()
    @Column()
    dob: string;

    @AutoMap()
    @Column()
    phone: string;

    @AutoMap()
    @Column()
    email: string;

    @AutoMap()
    @Column()
    avatar: string;

    @AutoMap()
    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @AutoMap()
    @ManyToOne(() => Status, (status) => status.users)
    status: Status;

    @AutoMap()
    @Column({ nullable: true })
    refreshToken: string;

    @OneToMany(() => Hotel, (hotel) => hotel.user)
    hotels: Hotel[];

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];

    @OneToMany(() => Discount, (discount) => discount.user)
    discounts: Discount[];
}
