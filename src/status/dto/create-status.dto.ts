import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'status' })
    status: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    expired: string;
}
