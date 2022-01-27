import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ImageHotelDto {
    @ApiProperty()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    images: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    hotelId: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    name: string;
}
