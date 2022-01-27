import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
export class RoomDiscountDto {
    @AutoMap()
    @ApiProperty()
    id: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    maPhong: number;

    @AutoMap()
    @ApiProperty()
    @Column()
    hotelName: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    hostName: string;
}
export class DiscountRoomDto {
    @ApiProperty()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    price: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    description: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    exp: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    status: string;

    @ApiProperty({ type: [RoomDiscountDto] })
    @AutoMap({ typeFn: () => RoomDiscountDto })
    @Column()
    rooms: RoomDiscountDto[];
}
