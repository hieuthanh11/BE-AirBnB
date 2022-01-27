import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UtilsID } from 'src/utils/dto/create-util.dto';
import { BaseRoomDto } from './base-room.dto';

export class RoomsID {
    @ApiProperty({ type: String, description: 'idRoom' })
    idRoom: string;
}
export class CreateRoomDto extends BaseRoomDto {
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'hotel' })
    hotelId: string;

    @ApiProperty({
        type: [UtilsID],
        description: 'list util id',
        default: [{ idUtil: '6d5b4b88-abd6-4f56-ad97-c4a450bd0f64' }],
    })
    utils: [UtilsID];
}
