import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseHotelDTO {
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'userName' })
    name: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'address' })
    address: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'images' })
    images: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'comment' })
    comment: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'openTime' })
    openTime: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'closeTime',
    })
    closeTime: string;

    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'roomQuantity' })
    roomQuantity: number;

    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'rate' })
    rate: number;
}
