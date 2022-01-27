import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RoomsID } from 'src/room/dto/create-room.dto';

export class CreateTicketDto {
    @IsNotEmpty()
    @ApiProperty({ default: new Date() })
    startDate: string;

    @IsNotEmpty()
    @ApiProperty({
        default: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 5,
        ),
    })
    endDate: string;

    @ApiProperty({
        type: [RoomsID],
        description: 'list service id',
        default: [
            { idRoom: 'a4e91739-bad1-450e-aa7b-1f9a733795d5' },
            { idRoom: 'bcd3ef24-9331-4bea-9861-37be47e05db1' },
        ],
    })
    rooms: [RoomsID];
}
