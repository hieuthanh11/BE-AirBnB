import { AutoMap } from '@automapper/classes';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Room } from 'src/room/entities/room.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'discount' })
export class Discount extends BaseEntityRoot {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    price: number;

    @AutoMap()
    @Column()
    description: string;

    @AutoMap()
    @Column()
    exp: string;

    @AutoMap()
    @ManyToOne(() => Status, (status) => status.discounts)
    status: Status;

    @AutoMap({ typeFn: () => Room })
    @OneToMany(() => Room, (room) => room.discounts)
    rooms: Room[];

    @AutoMap()
    @ManyToOne(() => User, (user) => user.discounts)
    user: User;
}
