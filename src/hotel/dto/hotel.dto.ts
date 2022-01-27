import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import ServiceDto from 'src/services/dto/service.dto';
import RoomBaseRootDto from 'src/room/dto/room.base.root.dto';
import { HotelImagesDto } from 'src/image-hotel/dto/hotel-image.dto';

export default class HotelDto {
    @ApiProperty()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    name: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    address: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    comment: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    openTime: string;

    @AutoMap()
    @Column()
    closeTime: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    roomQuantity: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    rate: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    hostName: string;

    @ApiProperty({ type: [ServiceDto] })
    @AutoMap({ typeFn: () => ServiceDto })
    @Column()
    services: ServiceDto[];

    @ApiProperty({ type: [RoomBaseRootDto] })
    @AutoMap({ typeFn: () => RoomBaseRootDto })
    @Column()
    rooms: RoomBaseRootDto[];

    @ApiProperty({ type: [HotelImagesDto] })
    @AutoMap({ typeFn: () => HotelImagesDto })
    @Column()
    images: HotelImagesDto[];
}
