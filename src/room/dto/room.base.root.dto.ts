import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import UtilDto from 'src/utils/dto/util.dto';
import { RoomImageDto } from 'src/imageroom/dto/roomImage.dto';
export default class RoomBaseRootDto {
    // use case get all hotel
    @AutoMap()
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    maPhong: number;

    @AutoMap()
    @ApiProperty()
    @Column()
    type: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    price: number;

    @AutoMap()
    @ApiProperty()
    @Column()
    status: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    discount: number;

    @ApiProperty({ type: [UtilDto] })
    @AutoMap({ typeFn: () => UtilDto })
    @Column()
    utils: UtilDto[];

    @ApiProperty({ type: [RoomImageDto] })
    @AutoMap({ typeFn: () => RoomImageDto })
    @Column()
    images: RoomImageDto[];
}
