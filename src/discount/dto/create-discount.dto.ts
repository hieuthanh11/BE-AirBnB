import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'price' })
    price: number;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'description' })
    desc: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'exp' })
    exp: string;
}
