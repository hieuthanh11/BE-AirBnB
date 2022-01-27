import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import RoomBaseRootDto from 'src/room/dto/room.base.root.dto';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class DiscountDto {
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

    @ApiProperty({ type: [RoomBaseRootDto] })
    @AutoMap({ typeFn: () => RoomBaseRootDto })
    @Column()
    rooms: RoomBaseRootDto[];
}
