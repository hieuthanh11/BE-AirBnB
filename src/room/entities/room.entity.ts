import { AutoMap } from '@automapper/classes';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Discount } from 'src/discount/entities/discount.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Imageroom } from 'src/imageroom/entities/imageroom.entity';
import { Status } from 'src/status/entities/status.entity';
import { RoomTicket } from 'src/ticket/entities/ticket.entity';
import { Util } from 'src/utils/entities/util.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room extends BaseEntityRoot {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    maPhong: number;

    @AutoMap()
    @Column()
    type: string;

    @AutoMap()
    @Column()
    price: number;

    @AutoMap()
    @ManyToOne(() => Status, (status) => status.rooms)
    status: Status;

    @AutoMap({ typeFn: () => Hotel })
    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    hotels: Hotel;

    @AutoMap({ typeFn: () => Util })
    @ManyToMany(() => Util, (util) => util.rooms)
    utils: Util[];

    @AutoMap()
    @ManyToOne(() => Discount, (discount) => discount.rooms)
    discounts: Discount;

    @OneToMany(() => RoomTicket, (roomTicket) => roomTicket.room)
    roomTicket: RoomTicket[];

    @OneToMany(() => Imageroom, (imageroom) => imageroom.room)
    imagesRoom: Imageroom[];
}
