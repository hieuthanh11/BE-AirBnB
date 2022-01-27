import { AutoMap } from '@automapper/classes';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Service } from 'src/services/entities/service.entity';
import { ImageHotel } from 'src/image-hotel/entities/image-hotel.entity';
@Entity()
export class Hotel extends BaseEntityRoot {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column()
    address: string;

    @AutoMap()
    @Column()
    comment: string;

    @AutoMap()
    @Column()
    openTime: string;

    @AutoMap()
    @Column()
    closeTime: string;

    @AutoMap()
    @Column()
    roomQuantity: number;

    @AutoMap()
    @Column()
    rate: number;

    @AutoMap()
    @ManyToOne(() => User, (user) => user.hotels)
    user: User;

    @AutoMap({ typeFn: () => Service })
    @ManyToMany(() => Service, (service) => service.hotels)
    services: Service[];

    @AutoMap({ typeFn: () => Room })
    @OneToMany(() => Room, (room) => room.hotels)
    rooms: Room[];

    @AutoMap()
    @OneToMany(() => ImageHotel, (imageHotel) => imageHotel.hotel)
    imagesHotel: ImageHotel[];
}
