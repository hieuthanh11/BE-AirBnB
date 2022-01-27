import { Column } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import RoomBaseRootDto from './room.base.root.dto';
export default class RoomDto extends RoomBaseRootDto {
    @AutoMap()
    @ApiProperty()
    @Column()
    hotel: string;
}
