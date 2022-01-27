import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ImageRoomDto {
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
    roomId: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    maPhong: number;
}
