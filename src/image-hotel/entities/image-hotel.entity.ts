import { AutoMap } from '@automapper/classes';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'image_hotel' })
export class ImageHotel extends BaseEntityRoot {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    images: string;

    @AutoMap()
    @ManyToOne(() => Hotel, (hotel) => hotel.imagesHotel)
    hotel: Hotel;
}
