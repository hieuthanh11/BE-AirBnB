import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ConfirmEmailDto {
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'name' })
    name: string;
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'email' })
    email: string;
}
