import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'services' })
export class Service extends BaseEntityRoot {
    @AutoMap()
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    name: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    desc: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    rate: number;

    @ManyToMany(() => Hotel, (hotel) => hotel.services, {
        cascade: true,
    })
    @JoinTable({
        name: 'hotel_service',
    })
    hotels: Hotel[];
}
