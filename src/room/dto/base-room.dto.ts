import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseRoomDto {
    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'maPhong' })
    maPhong: number;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'type' })
    type: string;

    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'price' })
    price: number;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'images' })
    images: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'status' })
    statusId: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'discount' })
    discountId: string;
}
