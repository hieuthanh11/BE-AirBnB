import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PayableDiscount {
    @IsOptional()
    @ApiProperty({
        type: Number,
        description: 'SizePage(Summary of element on page)',
        default: 5,
        required: false,
    })
    sizePage: number;

    @IsOptional()
    @ApiProperty({
        type: Number,
        description: 'NumberPage(Total number element on current page)',
        default: 1,
        required: false,
    })
    numberPage: number;
}
